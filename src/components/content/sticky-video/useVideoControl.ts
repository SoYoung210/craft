import { useCallback, useState } from 'react';
import ReactPlayer from 'react-player';

export function useMultiVideoControl() {
  const [players, setPlayers] = useState<ReactPlayer[] | null>(null);

  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const handleSeekChange = useCallback((value: number) => {
    setSeeking(true);
    setPlayed(value);
  }, []);

  const handleSeekMouseUp = useCallback(() => {
    setSeeking(false);
    // player?.seekTo(played);
    players?.forEach(player => player.seekTo(played));
  }, [played, players]);

  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  const addPlayer = useCallback((player: ReactPlayer) => {
    setPlayers(prevPlayers => {
      if (!prevPlayers) {
        return [player];
      }
      return [...prevPlayers, player];
    });
  }, []);

  const removePlayer = useCallback((player: ReactPlayer) => {
    setPlayers(prevPlayers => {
      if (!prevPlayers) {
        return null;
      }
      return prevPlayers.filter(p => p !== player);
    });
  }, []);

  return [
    { players, addPlayer, removePlayer },
    {
      playing,
      onPlayingChange: setPlaying,
      played,
      onPlayedChange: setPlayed,
      seeking,
      onSeekingChange: handleSeekChange,
      onSeekMouseDown: handleSeekMouseDown,
      onSeekMouseUp: handleSeekMouseUp,
    },
  ] as const;
}
