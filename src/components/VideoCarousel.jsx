import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;
  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },

      onComplete: () => {
        setVideo((preVideo) => ({
          ...preVideo,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  const [loadingData, setLoadedData] = useState([]);

  useEffect(() => {
    if (!loadingData.length > 3) {
      return;
    }

    !isPlaying
      ? videoRef.current[videoId].pause()
      : startPlay && videoRef.current[videoId].play();
  }, [startPlay, videoId, isPlaying, loadingData]);

  const handleLoadedMetaData = (index, event) => {
    setLoadedData((preData) => [...preData, event]);
  };

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;

    if (span[videoId]) {
      const animation = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(animation.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                    ? "10vw"
                    : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });

            gsap.to(span[videoId], {
              backgroundColor: "afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        animation.restart();
      }

      const animationUpdate = () => {
        animation.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      isPlaying
        ? gsap.ticker.add(animationUpdate)
        : gsap.ticker.remove(animationUpdate);
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, index) => {
    const updateFunctions = {
      "video-end": (preVideo) => ({
        ...preVideo,
        isEnd: true,
        videoId: index + 1,
      }),
      "video-last": (preVideo) => ({
        ...preVideo,
        isLastVideo: true,
      }),
      "video-reset": (preVideo) => ({
        ...preVideo,
        isLastVideo: false,
        videoId: 0,
      }),
      play: (preVideo) => ({
        ...preVideo,
        isPlaying: !preVideo.isPlaying,
      }),
      pause: (preVideo) => ({
        ...preVideo,
        isPlaying: !preVideo.isPlaying,
      }),
    };

    const updateFunction = updateFunctions[type];
    if (updateFunction) {
      setVideo(updateFunction);
    } else {
      // Handle default case
      return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="pr-10 sm:pr-20">
            {/* Container */}
            <div className="video-carousel_container">
              <div className="flex-center size-full overflow-hidden rounded-3xl bg-black">
                {/* Video */}
                <video
                  id="video"
                  className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[index] = el)}
                  onPlay={() => {
                    setVideo((preVideo) => ({ ...preVideo, isPlaying: true }));
                  }}
                  onEnded={() =>
                    index !== 3
                      ? handleProcess("video-end", index)
                      : handleProcess("video-last")
                  }
                  onLoadedMetadata={(event) =>
                    handleLoadedMetaData(index, event)
                  }
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              {/* Card Info */}
              <div className="absolute left-[5%] top-12 z-10">
                {list.textLists.map((text) => (
                  <p className="text-xl font-medium md:text-2xl" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control */}
      <div className="flex-center relative mt-10">
        <div className="flex-center rounded-full bg-gray-300 px-7 py-5 backdrop-blur">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(el) => (videoDivRef.current[index] = el)}
              className="relative mx-2 size-3 cursor-pointer rounded-full bg-gray-200"
            >
              <span
                className="absolute size-full rounded-full"
                ref={(el) => (videoSpanRef.current[index] = el)}
              />
            </span>
          ))}
        </div>

        {/* Pause/Play/Replay */}
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
