import type { LibraryEntry } from '../library/library.types';
import { apiUrl } from '../../lib/api-client';

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

export interface StoryCardData {
  gameId: string;
  title: string;
  coverUrl: string | null;
  rating: number;
  starRating: number;
  hoursPlayed: number;
  username: string;
}

export type StoryShareResult = 'shared' | 'downloaded';

export function storyCardDataFromEntry(
  entry: LibraryEntry,
  username: string,
): StoryCardData | null {
  if (entry.status !== 'COMPLETED' || !entry.review) {
    return null;
  }

  return {
    gameId: entry.game.id,
    title: entry.game.title,
    coverUrl: entry.game.coverUrl,
    rating: entry.review.rating,
    starRating: entry.review.starRating,
    hoursPlayed: entry.hoursPlayed,
    username,
  };
}

export function formatHoursPlayed(hours: number): string {
  return `${hours.toLocaleString('pt-BR')} ${hours === 1 ? 'hora' : 'horas'}`;
}

export function storyFileName(title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
  return `${slug || 'jogo'}-game-tracker.png`;
}

export async function createStoryCard(data: StoryCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas não está disponível neste navegador.');
  }

  drawBackground(context);
  const cover = data.coverUrl
    ? await loadImage(apiUrl(`/games/${encodeURIComponent(data.gameId)}/cover`))
    : null;
  if (cover) {
    drawCover(context, cover);
  } else {
    drawCoverPlaceholder(context);
  }
  drawContent(context, data);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('Não foi possível criar a imagem.')),
      'image/png',
    );
  });
}

export async function shareStoryCard(
  blob: Blob,
  title: string,
): Promise<StoryShareResult> {
  const file = new File([blob], storyFileName(title), { type: 'image/png' });
  const shareData: ShareData = {
    files: [file],
    title: `${title} • Game Tracker`,
  };

  if (
    navigator.share &&
    (!navigator.canShare || navigator.canShare(shareData))
  ) {
    await navigator.share(shareData);
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
  return 'downloaded';
}

function drawBackground(context: CanvasRenderingContext2D) {
  const gradient = context.createLinearGradient(
    0,
    0,
    STORY_WIDTH,
    STORY_HEIGHT,
  );
  gradient.addColorStop(0, '#171b2a');
  gradient.addColorStop(0.55, '#090b11');
  gradient.addColorStop(1, '#370008');
  context.fillStyle = gradient;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  context.strokeStyle = 'rgba(255, 61, 86, 0.12)';
  context.lineWidth = 2;
  for (let x = 0; x <= STORY_WIDTH; x += 72) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, STORY_HEIGHT);
    context.stroke();
  }
  for (let y = 0; y <= STORY_HEIGHT; y += 72) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(STORY_WIDTH, y);
    context.stroke();
  }
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const x = 90;
  const y = 210;
  const width = 900;
  const height = 900;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const frameRatio = width / height;
  const sourceWidth =
    imageRatio > frameRatio
      ? image.naturalHeight * frameRatio
      : image.naturalWidth;
  const sourceHeight =
    imageRatio > frameRatio
      ? image.naturalHeight
      : image.naturalWidth / frameRatio;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  context.save();
  context.shadowColor = 'rgba(245, 0, 34, 0.55)';
  context.shadowBlur = 45;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
  context.restore();
  context.strokeStyle = '#ff3d56';
  context.lineWidth = 8;
  context.strokeRect(x, y, width, height);
}

function drawCoverPlaceholder(context: CanvasRenderingContext2D) {
  context.fillStyle = '#222634';
  context.fillRect(90, 210, 900, 900);
  context.strokeStyle = '#ff3d56';
  context.lineWidth = 8;
  context.strokeRect(90, 210, 900, 900);
  context.fillStyle = '#727990';
  context.font = '700 42px monospace';
  context.textAlign = 'center';
  context.fillText('SEM CAPA', STORY_WIDTH / 2, 670);
}

function drawContent(context: CanvasRenderingContext2D, data: StoryCardData) {
  context.textAlign = 'left';
  context.fillStyle = '#ff3d56';
  context.font = '700 30px monospace';
  context.fillText('JOGO CONCLUÍDO // GAME TRACKER', 90, 145);

  context.fillStyle = '#ffffff';
  context.font = '700 72px sans-serif';
  const titleLines = wrapText(context, data.title.toUpperCase(), 900, 2);
  titleLines.forEach((line, index) =>
    context.fillText(line, 90, 1215 + index * 82),
  );

  const detailY = 1435 + (titleLines.length - 1) * 82;
  context.fillStyle = '#ff8090';
  context.font = '700 54px sans-serif';
  context.fillText(`${data.rating}/10`, 90, detailY);
  context.fillStyle = '#ffffff';
  context.font = '700 46px sans-serif';
  context.fillText(starLine(data.starRating), 90, detailY + 76);

  context.strokeStyle = 'rgba(255,255,255,0.2)';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(90, detailY + 130);
  context.lineTo(990, detailY + 130);
  context.stroke();

  context.fillStyle = '#ffffff';
  context.font = '700 52px sans-serif';
  context.fillText(formatHoursPlayed(data.hoursPlayed), 90, detailY + 220);
  context.fillStyle = '#9ca2b8';
  context.font = '32px monospace';
  context.fillText(`@${data.username}`, 90, 1810);
  context.textAlign = 'right';
  context.fillText('game tracker', 990, 1810);
}

function starLine(starRating: number): string {
  const fullStars = Math.floor(starRating);
  const halfStar = starRating % 1 !== 0;
  return `${'★'.repeat(fullStars)}${halfStar ? '½' : ''}${'☆'.repeat(5 - Math.ceil(starRating))}`;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (
    lines.length === maxLines &&
    words.join(' ').length > lines.join(' ').length
  ) {
    while (context.measureText(`${lines[maxLines - 1]}…`).width > maxWidth) {
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1);
    }
    lines[maxLines - 1] += '…';
  }
  return lines;
}

function loadImage(source: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}
