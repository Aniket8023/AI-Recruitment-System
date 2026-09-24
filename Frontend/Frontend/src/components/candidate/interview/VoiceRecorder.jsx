import {
  Mic,
  Square,
  RotateCcw,
  CheckCircle2,
  AudioLines,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const VoiceRecorder = ({
  onTranscript,
  onRecordingComplete,
  disabled = false,
}) => {
  /* =========================================================
     REFS
     ========================================================= */

  const mediaRecorderRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const chunksRef =
    useRef([]);

  const timerRef =
    useRef(null);

  const recognitionRef =
    useRef(null);

  const finalTranscriptRef =
    useRef("");

  const interimTranscriptRef =
    useRef("");

  const audioBlobRef =
    useRef(null);

  const recognitionActiveRef =
    useRef(false);

  const recognitionEndedRef =
    useRef(true);

  const recordingStoppedRef =
    useRef(false);

  /* =========================================================
     STATE
     ========================================================= */

  const [recording, setRecording] =
    useState(false);

  const [recordedAudio, setRecordedAudio] =
    useState(null);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [recordingTime, setRecordingTime] =
    useState(0);

  const [transcript, setTranscript] =
    useState("");

  const [error, setError] =
    useState("");

  const [speechSupported, setSpeechSupported] =
    useState(false);

  /* =========================================================
     CHECK SPEECH RECOGNITION
     ========================================================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSpeechSupported(
      Boolean(SpeechRecognition)
    );
  }, []);

  /* =========================================================
     CLEANUP
     ========================================================= */

  useEffect(() => {
    return () => {
      stopMicrophoneStream();

      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore cleanup errors.
        }
      }

      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );
      }
    };
  }, []);

  /* =========================================================
     STOP MICROPHONE
     ========================================================= */

  const stopMicrophoneStream = () => {
    if (!streamRef.current) {
      return;
    }

    streamRef.current
      .getTracks()
      .forEach((track) => {
        track.stop();
      });

    streamRef.current = null;
  };

  /* =========================================================
     SEND FINAL RESULT TO PARENT
     ========================================================= */

  const notifyParent = (
    audioBlob
  ) => {
    const finalTranscript =
      finalTranscriptRef.current.trim();

    const combinedTranscript =
      finalTranscript ||
      interimTranscriptRef.current.trim();

    if (combinedTranscript) {
      setTranscript(
        combinedTranscript
      );

      onTranscript?.(
        combinedTranscript
      );
    }

    if (audioBlob) {
      onRecordingComplete?.({
        audioBlob,
        transcript:
          combinedTranscript,
      });
    }
  };

  /* =========================================================
     START SPEECH RECOGNITION
     ========================================================= */

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    try {
      const recognition =
        new SpeechRecognition();

      recognitionRef.current =
        recognition;

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.lang = "en-US";

      finalTranscriptRef.current =
        "";

      interimTranscriptRef.current =
        "";

      recognitionEndedRef.current =
        false;

      recognitionActiveRef.current =
        true;

      recognition.onstart = () => {
        recognitionActiveRef.current =
          true;
      };

      recognition.onresult = (
        event
      ) => {
        let interim = "";
        let finalText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result =
            event.results[i];

          const text =
            result[0]?.transcript || "";

          if (result.isFinal) {
            finalText += text + " ";
          } else {
            interim += text;
          }
        }

        if (finalText) {
          finalTranscriptRef.current +=
            finalText;
        }

        interimTranscriptRef.current =
          interim;

        const liveTranscript =
          `${finalTranscriptRef.current} ${interim}`
            .trim();

        setTranscript(
          liveTranscript
        );

        onTranscript?.(
          liveTranscript
        );
      };

      recognition.onerror = (
        event
      ) => {
        console.warn(
          "Speech recognition:",
          event.error
        );

        /*
         * Do not stop MediaRecorder when
         * speech recognition has a temporary
         * browser error.
         */
      };

      recognition.onend = () => {
        recognitionActiveRef.current =
          false;

        recognitionEndedRef.current =
          true;

        /*
         * If recording has already stopped,
         * the final audio + transcript can now
         * be delivered.
         */
        if (
          recordingStoppedRef.current &&
          audioBlobRef.current
        ) {
          notifyParent(
            audioBlobRef.current
          );
        }
      };

      recognition.start();

    } catch (err) {
      console.warn(
        "Unable to start speech recognition:",
        err
      );

      recognitionActiveRef.current =
        false;

      recognitionEndedRef.current =
        true;
    }
  };

  /* =========================================================
     STOP SPEECH RECOGNITION
     ========================================================= */

  const stopSpeechRecognition = () => {
    if (
      !recognitionRef.current
    ) {
      recognitionEndedRef.current =
        true;

      return;
    }

    try {
      recognitionRef.current.stop();
    } catch {
      recognitionEndedRef.current =
        true;
    }
  };

  /* =========================================================
     START RECORDING
     ========================================================= */

  const startRecording = async () => {
    if (disabled) {
      return;
    }

    try {
      setError("");

      setTranscript("");

      setRecordedAudio(null);

      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );

        setAudioUrl("");
      }

      finalTranscriptRef.current =
        "";

      interimTranscriptRef.current =
        "";

      audioBlobRef.current =
        null;

      recordingStoppedRef.current =
        false;

      recognitionEndedRef.current =
        true;

      /* -----------------------------------------------------
         Check microphone support
         ----------------------------------------------------- */

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        setError(
          "Microphone recording is not supported by this browser."
        );

        return;
      }

      /* -----------------------------------------------------
         Request microphone
         ----------------------------------------------------- */

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          }
        );

      streamRef.current =
        stream;

      /* -----------------------------------------------------
         MediaRecorder
         ----------------------------------------------------- */

      let mimeType =
        "audio/webm";

      if (
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
      ) {
        mimeType =
          "audio/webm;codecs=opus";
      } else if (
        MediaRecorder.isTypeSupported(
          "audio/webm"
        )
      ) {
        mimeType =
          "audio/webm";
      }

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType,
          }
        );

      mediaRecorderRef.current =
        recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          chunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const blob =
          new Blob(
            chunksRef.current,
            {
              type:
                recorder.mimeType ||
                "audio/webm",
            }
          );

        audioBlobRef.current =
          blob;

        const url =
          URL.createObjectURL(
            blob
          );

        setRecordedAudio(
          blob
        );

        setAudioUrl(
          url
        );

        stopMicrophoneStream();

        /*
         * Speech recognition may still be
         * finishing its final result.
         */
        if (
          speechSupported &&
          recognitionRef.current
        ) {
          stopSpeechRecognition();

          setTimeout(() => {
            if (
              audioBlobRef.current
            ) {
              notifyParent(
                audioBlobRef.current
              );
            }
          }, 300);
        } else {
          notifyParent(blob);
        }
      };

      /* -----------------------------------------------------
         Start recorder
         ----------------------------------------------------- */

      recorder.start(
        250
      );

      setRecording(
        true
      );

      setRecordingTime(
        0
      );

      /* -----------------------------------------------------
         Timer
         ----------------------------------------------------- */

      timerRef.current =
        setInterval(() => {
          setRecordingTime(
            (previous) =>
              previous + 1
          );
        }, 1000);

      /* -----------------------------------------------------
         Start speech recognition
         ----------------------------------------------------- */

      if (speechSupported) {
        startSpeechRecognition();
      }

    } catch (err) {
      console.error(
        "Microphone error:",
        err
      );

      setError(
        "Microphone access is required to record your answer. Please allow microphone permission and try again."
      );

      stopMicrophoneStream();
    }
  };

  /* =========================================================
     STOP RECORDING
     ========================================================= */

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current
    ) {
      return;
    }

    recordingStoppedRef.current =
      true;

    if (
      timerRef.current
    ) {
      clearInterval(
        timerRef.current
      );

      timerRef.current =
        null;
    }

    setRecording(
      false
    );

    /*
     * Stop speech recognition first.
     */
    if (speechSupported) {
      stopSpeechRecognition();
    }

    /*
     * Stop audio recorder.
     * onstop will create Blob.
     */
    if (
      mediaRecorderRef.current
        .state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  /* =========================================================
     RESET
     ========================================================= */

  const resetRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore.
      }
    }

    stopSpeechRecognition();

    stopMicrophoneStream();

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current =
        null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(
        audioUrl
      );
    }

    setRecordedAudio(
      null
    );

    setAudioUrl(
      ""
    );

    setRecordingTime(
      0
    );

    setTranscript(
      ""
    );

    setError(
      ""
    );

    finalTranscriptRef.current =
      "";

    interimTranscriptRef.current =
      "";

    audioBlobRef.current =
      null;

    recordingStoppedRef.current =
      false;

    recognitionEndedRef.current =
      true;
  };

  /* =========================================================
     FORMAT TIME
     ========================================================= */

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remaining =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remaining
    ).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="voice-recorder">

      {/* =====================================================
          READY
          ===================================================== */}

      {!recording &&
        !recordedAudio && (
          <div className="voice-recorder-ready">

            <button
              type="button"
              className="voice-record-button"
              onClick={
                startRecording
              }
              disabled={
                disabled
              }
            >

              <span className="voice-record-icon">
                <Mic size={22} />
              </span>

              <span>
                <strong>
                  Record Answer
                </strong>

                <small>
                  Answer using your microphone
                </small>
              </span>

            </button>

            {!speechSupported && (
              <div className="voice-recorder-error">
                Voice transcription is not
                supported in this browser.
                Your audio will still be recorded.
              </div>
            )}

          </div>
        )}

      {/* =====================================================
          RECORDING
          ===================================================== */}

      {recording && (
        <div className="voice-recording-active">

          <div className="recording-status">

            <span className="recording-dot" />

            <span>
              Recording your answer
            </span>

            <strong>
              {formatTime(
                recordingTime
              )}
            </strong>

          </div>

          <div className="recording-wave">

            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />

          </div>

          <button
            type="button"
            className="stop-recording-button"
            onClick={
              stopRecording
            }
          >
            <Square
              size={16}
              fill="currentColor"
            />

            Stop Recording
          </button>

        </div>
      )}

      {/* =====================================================
          RECORDED
          ===================================================== */}

      {!recording &&
        recordedAudio && (
          <div className="voice-recording-complete">

            <div className="recording-complete-header">

              <div>

                <CheckCircle2
                  size={18}
                />

                <strong>
                  Recording ready
                </strong>

              </div>

              <span>
                {formatTime(
                  recordingTime
                )}
              </span>

            </div>

            {/* AUDIO PREVIEW */}

            <audio
              className="recorded-audio-player"
              controls
              src={audioUrl}
            />

            {/* TRANSCRIPT */}

            {transcript && (
              <div className="voice-transcript">

                <div className="voice-transcript-header">
                  <AudioLines
                    size={15}
                  />

                  <span>
                    Transcribed response
                  </span>
                </div>

                <p>
                  {transcript}
                </p>

              </div>
            )}

            {/* ACTIONS */}

            <div className="recording-actions">

              <button
                type="button"
                className="recording-secondary-button"
                onClick={
                  resetRecording
                }
                disabled={
                  disabled
                }
              >
                <RotateCcw
                  size={15}
                />

                Record Again
              </button>

              <div className="voice-ready-message">
                Your response is ready.
                Click Submit & Continue below.
              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="voice-recorder-error">
          {error}
        </div>
      )}

    </div>
  );
};

export default VoiceRecorder;