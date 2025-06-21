import { Circle, Path } from "react-native-svg"

export default function TelegramIcon() {
  return (
    <svg viewBox="0 0 240 240" className="w-5 h-5">
      <Circle cx="120" cy="120" r="120" fill="#37aee2" />
      <Path
        fill="#c8daea"
        d="M100 170l-6 19c8 0 12-4 16-8l24-24 42-40c3-3 0-5-4-3l-77 30z"
      />
      <Path
        fill="#a9c7dd"
        d="M100 170l-6 19c8 0 12-4 16-8l24-24 20-18-54 21z"
      />
      <Path
        fill="#fff"
        d="M94 152l5-63c1-6 9-8 12-2l14 29 40-36c5-4 11 2 7 7l-54 53-21 8c-4 2-4 0-3-3z"
      />
    </svg>
  )
}
