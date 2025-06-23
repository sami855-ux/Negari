import { Plus } from "lucide-react-native"
import { View } from "react-native"

const SquarePlusIcon = ({
  size = 24,
  color = "#4F46E5",
  background = "#FFFFFF",
}) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 6, // Small rounding
        borderWidth: 2,
        borderColor: color,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
      }}
      className="relative bottom-0 left-0 right-0 top-2"
    >
      <Plus
        size={size * 0.5}
        color={color}
        strokeWidth={2.5}
        style={{ position: "absolute" }}
      />
    </View>
  )
}

export default SquarePlusIcon
