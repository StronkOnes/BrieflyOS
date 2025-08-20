
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Slider, Typography, Modal, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Replay, CameraAlt, Close, ZoomIn, ZoomOut, Speed } from '@mui/icons-material';

const Teleprompter = ({ script, open, onClose }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [fontSize, setFontSize] = useState(48);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const animationFrameIdRef = useRef(null);

  const scrollStep = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollPositionRef.current += scrollSpeed / 10;
    scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    animationFrameIdRef.current = requestAnimationFrame(scrollStep);
  }, [scrollSpeed]);

  useEffect(() => {
    if (isScrolling) {
      animationFrameIdRef.current = requestAnimationFrame(scrollStep);
    } else {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [isScrolling, scrollStep]);

  const handlePlayPause = () => setIsScrolling(prev => !prev);
  const handleReset = () => {
    if (scrollContainerRef.current) {
      setIsScrolling(false);
      scrollContainerRef.current.scrollTop = 0;
      scrollPositionRef.current = 0;
    }
  };

  const handleTogglePip = async () => {
    if (!videoRef.current || !navigator.mediaDevices || !('pictureInPictureEnabled' in document)) {
      alert("Picture-in-Picture is not supported by your browser.");
      return;
    }
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
      } catch (error) {
        console.error("Error exiting PiP:", error);
      }
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await videoRef.current.requestPictureInPicture();
    } catch (error) {
      console.error("Error accessing camera or entering PiP:", error);
      alert("Could not access camera. Please check browser permissions.");
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnterPip = () => setIsPipActive(true);
    const onLeavePip = () => {
      setIsPipActive(false);
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      video.srcObject = null;
    };
    video.addEventListener('enterpictureinpicture', onEnterPip);
    video.addEventListener('leavepictureinpicture', onLeavePip);
    return () => {
      video.removeEventListener('enterpictureinpicture', onEnterPip);
      video.removeEventListener('leavepictureinpicture', onLeavePip);
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}>
        <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
        <Box
          ref={scrollContainerRef}
          sx={{
            height: 'calc(100% - 100px)',
            width: '100%',
            overflowY: 'scroll',
            transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              textAlign: 'center',
              p: '50vh 2rem',
              fontSize: `${fontSize}px`,
              lineHeight: 1.4,
              transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            {script}
          </Typography>
        </Box>

        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          <Tooltip title="Close (Esc)">
            <IconButton onClick={onClose} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
              <Close />
            </IconButton>
          </Tooltip>

          <Tooltip title={isScrolling ? 'Pause (Space)' : 'Play (Space)'}>
            <IconButton onClick={handlePlayPause} color="primary">
              {isScrolling ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton onClick={handleReset} color="primary">
              <Replay fontSize="large" />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <ZoomOut />
            <Slider
              value={fontSize}
              onChange={(e, newValue) => setFontSize(newValue)}
              min={12}
              max={100}
              step={1}
              sx={{ width: 150 }}
              aria-label="font size"
            />
            <ZoomIn />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <Speed />
            <Slider
              value={scrollSpeed}
              onChange={(e, newValue) => setScrollSpeed(newValue)}
              min={1}
              max={20}
              step={1}
              sx={{ width: 150 }}
              aria-label="scroll speed"
            />
          </Box>

          <Tooltip title="Mirror">
            <Button
              variant={isMirrored ? "contained" : "outlined"}
              onClick={() => setIsMirrored(m => !m)}
            >
              Mirror
            </Button>
          </Tooltip>
          <Tooltip title="Picture-in-Picture">
            <IconButton onClick={handleTogglePip} color={isPipActive ? "secondary" : "primary"}>
              <CameraAlt fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  );
};

export default Teleprompter;
