import mongodb from '@/lib/clients/mongodb';
import type { PodcastData } from '@/types/podcast-data';

/**
 * Field projection for PodcastData to optimize MongoDB queries
 * Only fetch the fields we need for the audio player
 */
const PODCAST_PROJECTION = {
  _id: 1,
  audio_url: 1,
};

/**
 * Fetches the latest podcast from the breaking-news.podcast collection
 * Returns the most recent record based on _id (which encodes creation time)
 */
export async function getLatestPodcast(): Promise<PodcastData | null> {
  try {
    const client = await mongodb;
    const dbName = process.env['MONGODB_DB_NAME'];
    const podcastCollection = process.env['MONGODB_PODCAST_COLLECTION'];

    if (!dbName || !podcastCollection) {
      throw new Error(
        'Missing required environment variables: MONGODB_DB_NAME and/or MONGODB_PODCAST_COLLECTION',
      );
    }

    const db = client.db(dbName);

    const doc = await db.collection(podcastCollection).findOne(
      {}, // No filter - find any document
      {
        projection: PODCAST_PROJECTION,
        sort: { _id: -1 }, // Sort by _id descending to get the latest
      },
    );

    if (!doc) {
      return null;
    }

    // Convert MongoDB document → PodcastData (ObjectId → string)
    const typedDoc = doc as unknown as {
      _id: { toString(): string };
      audio_url: string;
    };
    const { _id: documentId, audio_url: audioUrl } = typedDoc;

    return {
      _id: documentId.toString(),
      audio_url: audioUrl,
    } satisfies PodcastData;
  } catch (error) {
    console.error('Error fetching latest podcast:', error);
    return null;
  }
}
