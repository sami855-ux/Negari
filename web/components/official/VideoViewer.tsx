"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type VideoViewerProps = {
  videoUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
  thumbnail?: string
}

export function VideoViewer({
  videoUrl,
  open,
  onOpenChange,
  thumbnail,
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>()

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!open) {
      setIsPlaying(false)
      setCurrentTime(0)
      setError(null)
      setIsLoading(true)
    } else {
      setIsLoading(true)
      setError(null)
    }
  }, [open])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      console.log("Video can play now - hiding loading spinner")
      setIsLoading(false)
      setDuration(video.duration)
    }

    const handleError = () => {
      console.log("Video failed to load")
      setIsLoading(false)
      setError("Failed to load video. Please try again later.")
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleWaiting = () => {
      console.log("Video is buffering - showing loading spinner")
      //   setIsLoading(true)
    }

    const handlePlaying = () => {
      console.log("Video is playing - hiding loading spinner")
      setIsLoading(false)
    }

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [])

  // Handle video source when URL changes
  useEffect(() => {
    if (videoRef.current && open) {
      console.log("Video URL or modal open changed, loading video")
      setIsLoading(true)
      setError(null)
      videoRef.current.load()
    }
  }, [videoUrl, open])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case " ":
          e.preventDefault()
          handlePlayPause()
          break
        case "ArrowLeft":
          e.preventDefault()
          seek(-5)
          break
        case "ArrowRight":
          e.preventDefault()
          seek(5)
          break
        case "m":
          e.preventDefault()
          toggleMute()
          break
        case "f":
          e.preventDefault()
          toggleFullscreen()
          break
        case "Escape":
          if (isFullscreen) {
            toggleFullscreen()
          } else {
            onOpenChange(false)
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, isFullscreen])

  // Auto-hide controls
  useEffect(() => {
    if (!open) return

    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false)
      }
    }

    if (controlsTimeout) clearTimeout(controlsTimeout)
    setControlsTimeout(setTimeout(hideControls, 3000))

    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout)
    }
  }, [showControls, isPlaying, open])

  const handlePlayPause = () => {
    if (error) return

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(() => {
          setError("Playback failed. Please try again.")
        })
      }
      setIsPlaying(!isPlaying)
    }
    showControlsNow()
  }

  const seek = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      )
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
    showControlsNow()
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
    showControlsNow()
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    showControlsNow()
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      videoRef.current.muted = newMuted
    }
    showControlsNow()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
    showControlsNow()
  }

  const showControlsNow = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    setControlsTimeout(
      setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    )
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black border border-gray-900"
        onPointerMove={showControlsNow}
        onMouseEnter={showControlsNow}
      >
        {/* Video Container */}
        <div className="relative w-full h-full aspect-video bg-black">
          {/* Loading State */}
          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
              <span className="sr-only">Loading video...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-xl font-medium text-white">Video Error</h3>
              <p className="text-gray-300">{error}</p>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                  videoRef.current?.load()
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoUrl}
            className={cn(
              "w-full h-full object-contain",
              isLoading || error ? "opacity-0" : "opacity-100"
            )}
            onClick={handlePlayPause}
            onTimeUpdate={() =>
              setCurrentTime(videoRef.current?.currentTime || 0)
            }
            onLoadedMetadata={() => {
              setDuration(videoRef.current?.duration || 0)
              if (videoRef.current) {
                videoRef.current.volume = volume
              }
            }}
            poster={thumbnail}
            playsInline
            preload="auto"
          />

          {/* Overlay Controls */}
          <div
            ref={controlsRef}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0",
              (isLoading || error) && "hidden"
            )}
          >
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Center Play Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-16 w-16 text-white hover:bg-white/10"
                  onClick={handlePlayPause}
                >
                  <Play className="h-8 w-8 fill-white" />
                </Button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent space-y-2">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full">
                <Progress
                  value={(currentTime / duration) * 100 || 0}
                  className="h-2 flex-1 cursor-pointer"
                  onClick={(e) => {
                    if (videoRef.current && controlsRef.current) {
                      const rect = controlsRef.current.getBoundingClientRect()
                      const percent = (e.clientX - rect.left) / rect.width
                      const newTime = percent * duration
                      videoRef.current.currentTime = newTime
                      setCurrentTime(newTime)
                    }
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-white" />
                    ) : (
                      <Play className="h-5 w-5 fill-white" />
                    )}
                  </Button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Fullscreen Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
