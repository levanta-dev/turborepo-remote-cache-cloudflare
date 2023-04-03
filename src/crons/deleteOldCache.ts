import { Env } from '..';

const BUCKET_CUTOFF_HOURS = 30 * 24; // 30 days

export async function deleteOldCache(env: Env) {
  let truncated = false;
  let cursor: string | undefined;
  let list: R2Objects;
  const keysMarkedForDeletion: string[] = [];

  do {
    list = await env.R2_STORE.list({ limit: 500, cursor });
    truncated = list.truncated;
    cursor = list.cursor;

    for (const object of list.objects) {
      if (isDateOlderThan(object.uploaded, BUCKET_CUTOFF_HOURS)) {
        keysMarkedForDeletion.push(object.key);
      }
    }
  } while (truncated);

  if (keysMarkedForDeletion.length > 0) {
    console.log(`Deleting ${keysMarkedForDeletion.length} keys`, keysMarkedForDeletion);
    await env.R2_STORE.delete(keysMarkedForDeletion);
  }
}

function isDateOlderThan(date: Date, hours: number) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hoursDiff = diff / (1000 * 60 * 60);
  console.log('hoursDiff', hoursDiff);
  return hoursDiff > hours;
}
