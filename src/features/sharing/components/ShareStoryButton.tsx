import { useState } from 'react';
import { secondaryButtonClasses } from '../../../components/form-classes';
import { useAuthenticatedUser } from '../../auth/use-current-user';
import type { LibraryEntry } from '../../library/library.types';
import {
  createStoryCard,
  shareStoryCard,
  storyCardDataFromEntry,
} from '../story-card';

export function ShareStoryButton({ entry }: { entry: LibraryEntry }) {
  const user = useAuthenticatedUser();
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const data = storyCardDataFromEntry(entry, user.username);

  if (!data) return null;

  async function handleShare() {
    if (!data) return;
    setIsCreating(true);
    setMessage(null);
    try {
      const image = await createStoryCard(data);
      const result = await shareStoryCard(image, data.title);
      setMessage(
        result === 'shared'
          ? 'Imagem pronta para compartilhar.'
          : 'Imagem baixada. Adicione-a ao seu Story do Instagram.',
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage('Não foi possível criar o Story. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-2 border-t border-zinc-600/40 pt-4">
      <button
        type="button"
        className={`${secondaryButtonClasses} w-full`}
        disabled={isCreating}
        onClick={() => void handleShare()}
      >
        {isCreating ? 'Criando Story…' : 'Compartilhar no Story'}
      </button>
      <p className="text-xs text-zinc-700">
        Gera uma imagem vertical com sua nota e tempo de jogo.
      </p>
      {message && (
        <p aria-live="polite" className="text-xs text-zinc-700">
          {message}
        </p>
      )}
    </div>
  );
}
