"use client";
import useSound from "use-sound";

export default function Sample() {
  const [play, { stop, pause }] = useSound("/sounds/決定ボタンを押す2.mp3");

  return <button onClick={play}>再生</button>;
}
