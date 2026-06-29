import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { TASTE_MAPPINGS } from './taste_doctrine.ts';

export class TasteQueryManager {
  private db: any;

  async init() {
    const dbPath = path.join(process.cwd(), 'data/sqlite/arta.db');
    
    // If we are running from mcp_server, we need to go up one level
    const adjustedPath = process.cwd().includes('mcp_server') 
      ? path.join(process.cwd(), '..', 'data/sqlite/arta.db')
      : dbPath;

    this.db = await open({
      filename: adjustedPath,
      driver: sqlite3.Database,
    });
  }

  /**
   * The Triptych of Context: Core, Tide, and Gap.
   * This provides the Brain with the emotional landscape of the user.
   */
  async getTriptychContext() {
    const core = await this.getCoreTaste();
    const tide = await this.getTidalTrends();
    const gap = await this.getTasteGaps();

    return {
      core,
      tide,
      gap,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generates a compact taste profile.
   * Aggregates the most frequent reaction types and mediums to provide a high-level summary.
   */
  async getTasteSignals() {
    const reactionCounts = await this.db.all(`
      SELECT reaction_type, COUNT(*) as count 
      FROM reactions 
      GROUP BY reaction_type 
      ORDER BY count DESC
    `);

    const mediumCounts = await this.db.all(`
      SELECT medium, COUNT(*) as count 
      FROM works 
      GROUP BY medium 
      ORDER BY count DESC
    `);

    const totalResult = await this.db.get(`SELECT COUNT(*) as count FROM works`);

    return {
      dominantReactions: reactionCounts.map(r => `${r.reaction_type}: ${r.count}`),
      dominantMediums: mediumCounts.map(m => `${m.medium}: ${m.count}`),
      totalWorks: totalResult ? totalResult.count : 0,
      timestamp: new Date().toISOString()
    };
  }

  private async getCoreTaste() {
    // Core: High-intensity, consistent signals across time.
    // We use the doctrine to determine what "high intensity" means.
    const minIntensity = TASTE_MAPPINGS['INTERESTING'].intensity; 

    const coreWorks = await this.db.all(`
      SELECT w.title, w.creator, r.reaction_type, r.intensity
      FROM works w
      JOIN reactions r ON w.id = r.work_id
      WHERE r.intensity >= ? AND r.reaction_type IN ('admired', 'moved', 'liked')
      ORDER BY r.intensity DESC
      LIMIT 10
    `, [minIntensity]);

    return {
      description: "The immutable pillars of taste. High-intensity emotional anchors.",
      signals: coreWorks.map(w => `${w.title} (${w.creator}) - ${w.reaction_type} [${w.intensity}]`)
    };
  }

  private async getTidalTrends() {
    // Tide: Recent shifts in taste.
    // We use a relative anchor: the most recent entry in the database.
    const lastEntry = await this.db.get(`SELECT created_at FROM reactions ORDER BY created_at DESC LIMIT 1`);
    const anchorDate = lastEntry ? lastEntry.created_at : 'now';

    const recentWorks = await this.db.all(`
      SELECT w.title, r.reaction_type, r.created_at
      FROM works w
      JOIN reactions r ON w.id = r.work_id
      WHERE r.created_at >= date(?, '-90 days')
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [anchorDate]);

    return {
      description: "The current emotional current. Recent shifts and temporary obsessions.",
      signals: recentWorks.map(w => `${w.title} - ${w.reaction_type} (${w.created_at})`)
    };
  }

  private async getTasteGaps() {
    // Gap: The "Silent Spaces". 
    // Works that are 'saved' or 'unknown' but not yet reacted to, 
    // or mediums that are under-represented.
    const gaps = await this.db.all(`
      SELECT medium, COUNT(*) as count
      FROM works
      GROUP BY medium
      ORDER BY count ASC
    `);

    return {
      description: "The unexplored territories. Where the user is curious but hasn't ventured.",
      signals: gaps.map(g => `${g.medium}: ${g.count} entries`)
    };
  }

  async close() {
    if (this.db) {
      await this.db.close();
    }
  }
}