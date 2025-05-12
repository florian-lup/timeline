#!/usr/bin/env ts-node

/**
 * Event Pipeline Runner
 * 
 * This script runs the event pipeline to search, deduplicate, and store global events.
 */

import { runEventPipeline } from '../app/api/events/route';

console.log('=== Event Pipeline Tool ===');
console.log('Fetching, deduplicating, and storing global events');
console.log('------------------------------------');

// Run the pipeline
runEventPipeline()
  .then(() => {
    console.log('------------------------------------');
    console.log('Event pipeline execution completed.');
  })
  .catch((error) => {
    console.error('Pipeline execution failed:', error);
    process.exit(1);
  }); 