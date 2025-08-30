// // AudioRecorder.js
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react"
// import { Audio } from "expo-av"

// const AudioRecorder = forwardRef(({ onAudioDataChange }, ref) => {
//   const recordingRef = useRef(null)
//   const soundRef = useRef(null)
//   const [permissionGranted, setPermissionGranted] = useState(false)
//   const [audioUri, setAudioUri] = useState(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)

//   useEffect(() => {
//     ;(async () => {
//       const response = await Audio.requestPermissionsAsync()
//       setPermissionGranted(response.granted)
//     })()
//   }, [])

//   useImperativeHandle(ref, () => ({
//     startRecording,
//     stopRecording,
//     playAudio,
//     stopAudio,
//     deleteAudio,
//     isRecording,
//     isPlaying,
//     audioUri,
//   }))

//   const startRecording = async () => {
//     if (!permissionGranted) throw new Error("Permission not granted")

//     try {
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       })

//       const recording = new Audio.Recording()
//       await recording.prepareToRecordAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       )
//       await recording.startAsync()

//       recordingRef.current = recording
//       setIsRecording(true)
//     } catch (e) {
//       console.error("Failed to start recording", e)
//     }
//   }

//   const stopRecording = async () => {
//     if (!recordingRef.current) return

//     try {
//       await recordingRef.current.stopAndUnloadAsync()
//       const uri = recordingRef.current.getURI()
//       setAudioUri(uri)
//       setIsRecording(false)
//       recordingRef.current = null

//       if (onAudioDataChange) onAudioDataChange(uri)
//     } catch (e) {
//       console.error("Failed to stop recording", e)
//     }
//   }

//   const playAudio = async () => {
//     if (!audioUri) return

//     try {
//       if (soundRef.current) {
//         await soundRef.current.unloadAsync()
//         soundRef.current = null
//       }

//       const { sound } = await Audio.Sound.createAsync({ uri: audioUri })
//       soundRef.current = sound

//       sound.setOnPlaybackStatusUpdate((status) => {
//         if (!status.isPlaying) {
//           setIsPlaying(false)
//         }
//       })

//       setIsPlaying(true)
//       await sound.playAsync()
//     } catch (e) {
//       console.error("Failed to play audio", e)
//     }
//   }

//   const stopAudio = async () => {
//     if (soundRef.current) {
//       await soundRef.current.stopAsync()
//       await soundRef.current.unloadAsync()
//       soundRef.current = null
//       setIsPlaying(false)
//     }
//   }

//   const deleteAudio = async () => {
//     if (soundRef.current) {
//       await soundRef.current.stopAsync()
//       await soundRef.current.unloadAsync()
//       soundRef.current = null
//     }
//     setAudioUri(null)
//     if (onAudioDataChange) onAudioDataChange(null)
//   }

//   return null // no UI, logic only
// })

// export default AudioRecorder
