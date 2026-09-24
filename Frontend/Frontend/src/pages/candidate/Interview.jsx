import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Video,
  Sparkles,
  Clock3,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw,
  Mic,
  PenLine,
  ShieldCheck,
  Camera,
  Maximize,
  AlertTriangle,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

import interviewService from "../../services/interviewService";
import { useAuth } from "../../context/AuthContext";

import AIInterviewerOrb from "../../components/candidate/interview/AIInterviewerOrb";
import VoiceRecorder from "../../components/candidate/interview/VoiceRecorder";
import TextAnswer from "../../components/candidate/interview/TextAnswer";

import "../../components/candidate/interview/interviewVoice.css";

const Interview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useAuth();

  const jobId = searchParams.get("jobId");
  const resumeId = searchParams.get("resumeId");

  const candidateId = user?.userId;

  /*
  ============================================================
  INTERVIEW DATA
  ============================================================
  */

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
const [voiceAnswerReady, setVoiceAnswerReady] = useState(false);

  const [error, setError] = useState("");

  const [started, setStarted] = useState(false);

  const [evaluation, setEvaluation] = useState(null);

  const [timeLeft, setTimeLeft] = useState(
    20 * 60
  );

  /*
  ============================================================
  ANSWER MODE
  ============================================================
  */

  const [answerMode, setAnswerMode] =
    useState("voice");

  /*
  ============================================================
  AI SPEECH
  ============================================================
  */

  const [aiSpeaking, setAiSpeaking] =
    useState(false);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const speechSupportedRef =
    useRef(
      typeof window !== "undefined" &&
        "speechSynthesis" in window
    );

  /*
  ============================================================
  PROCTORING
  ============================================================
  */

  const [cameraStream, setCameraStream] =
    useState(null);

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [fullscreenActive, setFullscreenActive] =
    useState(false);

  const [violations, setViolations] =
    useState(0);

  const [violationMessage, setViolationMessage] =
    useState("");

  const [showViolationWarning, setShowViolationWarning] =
    useState(false);

  const [startingProctoring, setStartingProctoring] =
    useState(false);

  /*
  ============================================================
  REFS
  ============================================================
  */

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const violationCountRef =
    useRef(0);

  const autoSubmittedRef =
    useRef(false);

  const warningTimeoutRef =
    useRef(null);

  const speechRecognitionRef =
    useRef(null);


    const voiceAnswerAudioRef =
  useRef(null);
  /*
  ============================================================
  LOAD QUESTIONS
  ============================================================
  */

  useEffect(() => {
    if (
      !jobId ||
      !resumeId ||
      !candidateId
    ) {
      setError(
        "Interview information is missing. Please return to your assessment."
      );

      setLoading(false);

      return;
    }

    loadInterviewQuestions();
  }, [
    jobId,
    resumeId,
    candidateId,
  ]);

  const loadInterviewQuestions =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await interviewService.getQuestions(
            candidateId,
            jobId,
            resumeId
          );

        if (
          data &&
          data.length > 0
        ) {
          setQuestions(data);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.log(
          "Interview questions not generated yet."
        );

        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

  /*
  ============================================================
  CURRENT QUESTION
  ============================================================
  */

  const currentQuestion =
    questions[currentIndex];

  /*
  ============================================================
  TEXT TO SPEECH
  ============================================================
  */

  const stopAISpeech = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setAiSpeaking(false);
  };

  const speakQuestion = (
    questionText
  ) => {
    if (
      !voiceEnabled ||
      !speechSupportedRef.current ||
      !questionText
    ) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          questionText
        );

      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setAiSpeaking(true);
      };

      utterance.onend = () => {
        setAiSpeaking(false);
      };

      utterance.onerror = () => {
        setAiSpeaking(false);
      };

      window.speechSynthesis.speak(
        utterance
      );
    } catch (err) {
      console.error(
        "AI speech error:",
        err
      );

      setAiSpeaking(false);
    }
  };

  /*
  ============================================================
  SPEAK QUESTION WHEN QUESTION CHANGES
  ============================================================
  */

  useEffect(() => {
    if (
      !started ||
      !currentQuestion ||
      !voiceEnabled
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
        speakQuestion(
          currentQuestion.question
        );
      }, 400);

    return () => {
      clearTimeout(timer);
      stopAISpeech();
    };
  }, [
    started,
    currentIndex,
    currentQuestion?.question,
    voiceEnabled,
  ]);

  /*
  ============================================================
  START CAMERA
  ============================================================
  */

  const startCamera = async () => {
    try {
      setCameraError("");
      setCameraReady(false);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera is not supported."
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        streamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
              facingMode: "user",
            },
            audio: false,
          }
        );

      const videoTrack =
        stream.getVideoTracks()[0];

      if (!videoTrack) {
        throw new Error(
          "No camera track found."
        );
      }

      console.log(
        "Interview camera track:",
        videoTrack.readyState
      );

      streamRef.current =
        stream;

      setCameraStream(stream);

      return true;
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );

      setCameraError(
        "Unable to access camera. Please allow camera permission."
      );

      setCameraReady(false);

      return false;
    }
  };

  /*
  ============================================================
  ATTACH CAMERA
  ============================================================
  */

  useEffect(() => {
    if (!cameraStream) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    video.srcObject =
      cameraStream;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    const playVideo =
      async () => {
        try {
          await video.play();
          setCameraReady(true);
        } catch (err) {
          console.error(
            "Camera preview error:",
            err
          );

          setCameraReady(false);
        }
      };

    playVideo();

    return () => {
      video.pause();
      video.srcObject = null;
    };
  }, [cameraStream]);

  /*
  ============================================================
  STOP CAMERA
  ============================================================
  */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;
    }

    setCameraStream(null);
    setCameraReady(false);
  };

  /*
  ============================================================
  FULLSCREEN
  ============================================================
  */

  const enterFullscreen =
    async () => {
      try {
        if (
          !document.fullscreenElement
        ) {
          await document.documentElement.requestFullscreen();
        }

        setFullscreenActive(true);

        return true;
      } catch (err) {
        console.error(
          "Fullscreen error:",
          err
        );

        setFullscreenActive(false);

        return false;
      }
    };

  const exitFullscreen =
    async () => {
      try {
        if (
          document.fullscreenElement
        ) {
          await document.exitFullscreen();
        }

        setFullscreenActive(false);
      } catch (err) {
        console.error(
          "Fullscreen exit error:",
          err
        );
      }
    };

  /*
  ============================================================
  VIOLATIONS
  ============================================================
  */

  const registerViolation =
    (message) => {
      if (submitting) {
        return;
      }

      violationCountRef.current += 1;

      const count =
        violationCountRef.current;

      setViolations(count);
      setViolationMessage(message);
      setShowViolationWarning(true);

            if (
        warningTimeoutRef.current
      ) {
        clearTimeout(
          warningTimeoutRef.current
        );
      }

      warningTimeoutRef.current =
        setTimeout(() => {
          setShowViolationWarning(false);
        }, 3500);

      /*
       * Three violations:
       * automatically submit/terminate interview.
       */
      if (
        count >= 3 &&
        !autoSubmittedRef.current
      ) {
        autoSubmittedRef.current = true;

        handleSecurityTermination();
      }
    };

  /*
  ============================================================
  SECURITY TERMINATION
  ============================================================
  */

  const handleSecurityTermination = async () => {
  if (submitting) {
    return;
  }

  try {
    setSubmitting(true);
    stopAISpeech();

    const violationCount = violationCountRef.current;

    const reason =
      violationMessage ||
      "Interview terminated after reaching the maximum number of security violations.";

    let result = null;

    try {
      result = await interviewService.terminateInterview(
        candidateId,
        jobId,
        violationCount,
        reason
      );
    } catch (terminationError) {
      console.error(
        "Backend interview termination failed:",
        terminationError
      );

      setError(
        terminationError?.response?.data?.message ||
          "Interview termination could not be recorded."
      );

      return;
    }

    stopCamera();
    await exitFullscreen();

    navigate(
      `/candidate/interview-result?candidateId=${candidateId}&jobId=${jobId}&terminated=true`,
      {
        state: {
          result,
          automatic: true,
          violations: violationCount,
          securityTerminated: true,
        },
        replace: true,
      }
    );
  } catch (err) {
    console.error(
      "Security termination error:",
      err
    );

    stopCamera();
    await exitFullscreen();

    setStarted(false);

    setError(
      err?.response?.data?.message ||
        "The interview was terminated due to a security violation."
    );
  } finally {
    setSubmitting(false);
  }
};

  /*
  ============================================================
  START INTERVIEW
  ============================================================
  */

  const startInterview = async () => {
    if (startingProctoring) {
      return;
    }

    try {
      setStartingProctoring(true);

      setError("");
      setCameraError("");

      /*
       * Start fullscreen and camera from the same
       * user click.
       */
      const fullscreenStarted =
        await enterFullscreen();

      if (!fullscreenStarted) {
        setCameraError(
          "Fullscreen permission is required to start the interview."
        );

        return;
      }

      const cameraStarted =
        await startCamera();

      if (!cameraStarted) {
        await exitFullscreen();

        return;
      }

      /*
       * If questions do not exist, generate them.
       */
      let interviewQuestions =
        questions;

      if (
        !interviewQuestions ||
        interviewQuestions.length === 0
      ) {
        const response =
          await interviewService.generateQuestions(
            jobId,
            candidateId,
            resumeId
          );

        if (
          !response ||
          !response.questions ||
          response.questions.length === 0
        ) {
          throw new Error(
            "No interview questions were generated."
          );
        }

        const savedQuestions =
          await interviewService.getQuestions(
            candidateId,
            jobId,
            resumeId
          );

        if (
          !savedQuestions ||
          savedQuestions.length === 0
        ) {
          throw new Error(
            "Interview questions could not be loaded."
          );
        }

        interviewQuestions =
          savedQuestions;

        setQuestions(
          savedQuestions
        );
      }

      /*
       * Reset interview state.
       */
      violationCountRef.current = 0;
      autoSubmittedRef.current = false;

      setViolations(0);
      setCurrentIndex(0);
      setAnswer("");
      setEvaluation(null);
      setTimeLeft(20 * 60);

      setStarted(true);

    } catch (err) {
      console.error(
        "Failed to start interview:",
        err
      );

      stopCamera();
      await exitFullscreen();

      setStarted(false);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to start the interview."
      );
    } finally {
      setStartingProctoring(false);
    }
  };

  /*
  ============================================================
  FULLSCREEN MONITOR
  ============================================================
  */

  useEffect(() => {
    if (!started) {
      return;
    }

    const handleFullscreenChange = () => {
      const active =
        !!document.fullscreenElement;

      setFullscreenActive(active);

      if (
        !active &&
        !submitting
      ) {
        registerViolation(
          "You exited fullscreen mode. Please remain in fullscreen during the interview."
        );
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, [
    started,
    submitting,
  ]);

  /*
  ============================================================
  COPY / PASTE / CONTEXT MENU
  ============================================================
  */

  useEffect(() => {
    if (!started) {
      return;
    }

    const preventClipboard =
      (event) => {
        event.preventDefault();

        registerViolation(
          "Copy, cut and paste actions are not allowed during the interview."
        );
      };

    const preventContextMenu =
      (event) => {
        event.preventDefault();

        registerViolation(
          "Right-click is not allowed during the interview."
        );
      };

    document.addEventListener(
      "copy",
      preventClipboard
    );

    document.addEventListener(
      "cut",
      preventClipboard
    );

    document.addEventListener(
      "paste",
      preventClipboard
    );

    document.addEventListener(
      "contextmenu",
      preventContextMenu
    );

    return () => {
      document.removeEventListener(
        "copy",
        preventClipboard
      );

      document.removeEventListener(
        "cut",
        preventClipboard
      );

      document.removeEventListener(
        "paste",
        preventClipboard
      );

      document.removeEventListener(
        "contextmenu",
        preventContextMenu
      );
    };
  }, [started]);

  /*
  ============================================================
  KEYBOARD SECURITY
  ============================================================
  */

  useEffect(() => {
    if (!started) {
      return;
    }

    const handleKeyboard = (event) => {
      const key =
        event.key.toLowerCase();

      /*
       * PrintScreen can be detected in some browsers,
       * but browsers cannot guarantee blocking OS screenshots.
       */
      if (
        key === "printscreen"
      ) {
        event.preventDefault();

        registerViolation(
          "Screenshot shortcut detected. Screenshots are not allowed during the interview."
        );

        return;
      }

      const blockedShortcut =
        (event.ctrlKey &&
          [
            "c",
            "v",
            "x",
            "a",
            "p",
            "s",
            "u",
          ].includes(key)) ||
        (event.metaKey &&
          [
            "c",
            "v",
            "x",
            "a",
            "p",
            "s",
            "u",
          ].includes(key)) ||
        key === "f12";

      if (
        blockedShortcut
      ) {
        event.preventDefault();

        registerViolation(
          "Restricted keyboard shortcut detected."
        );
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [started]);

  /*
  ============================================================
  TAB / WINDOW SWITCH
  ============================================================
  */

  useEffect(() => {
    if (!started) {
      return;
    }

    const handleVisibility =
      () => {
        if (
          document.hidden
        ) {
          registerViolation(
            "You left the interview window."
          );
        }
      };

    const handleBlur = () => {
      registerViolation(
        "Interview window lost focus."
      );
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "blur",
      handleBlur
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "blur",
        handleBlur
      );
    };
  }, [started]);

  /*
  ============================================================
  CAMERA TRACK MONITOR
  ============================================================
  */

  useEffect(() => {
    if (
      !started ||
      !cameraStream
    ) {
      return;
    }

    const track =
      cameraStream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    const handleEnded = () => {
      setCameraReady(false);

      registerViolation(
        "Camera monitoring was stopped. Please enable your camera."
      );
    };

    track.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      track.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [
    started,
    cameraStream,
  ]);

  /*
  ============================================================
  TIMER
  ============================================================
  */

  useEffect(() => {
    if (
      !started ||
      submitting
    ) {
      return;
    }

    if (
      timeLeft <= 0
    ) {
      if (
        !autoSubmittedRef.current
      ) {
        autoSubmittedRef.current =
          true;

        finishInterview(true);
      }

      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) =>
            previous > 0
              ? previous - 1
              : 0
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    started,
    submitting,
    timeLeft,
  ]);

  /*
  ============================================================
  ANSWER MODE
  ============================================================
  */

  const handleVoiceTranscript =
  (transcript) => {

    if (!transcript) {
      return;
    }

    setAnswer(
      transcript
    );

    setError("");
  };

 const handleVoiceRecordingComplete = ({
  audioBlob,
  transcript,
}) => {

  if (audioBlob) {
    voiceAnswerAudioRef.current = audioBlob;
    setVoiceAnswerReady(true);
  }

  if (transcript && transcript.trim()) {
    setAnswer(transcript.trim());
  }

  setError("");
};

  /*
  ============================================================
  SUBMIT ANSWER
  ============================================================
  */

 const submitCurrentAnswer = async () => {

  if (!currentQuestion) {
    return;
  }

  const finalAnswer = answer.trim();

  // =========================================================
  // VALIDATE ANSWER
  // =========================================================

  if (answerMode === "voice") {

    if (!voiceAnswerAudioRef.current) {

      setError(
        "Please record your answer before continuing."
      );

      return;
    }

  } else {

    if (!finalAnswer) {

      setError(
        "Please enter your answer before continuing."
      );

      return;
    }
  }


  try {

    setSubmitting(true);
    setError("");

    stopAISpeech();


    // =======================================================
    // SAVE LOCALLY
    // =======================================================

    setAnswers(
      (previous) => ({
        ...previous,

        [currentQuestion.questionId]:
          answerMode === "voice"
            ? "[Voice Answer]"
            : finalAnswer,
      })
    );


    // =======================================================
    // SUBMIT ANSWER
    // =======================================================

    let result;


    // =======================================================
    // VOICE ANSWER
    // =======================================================

    if (
      answerMode === "voice" &&
      voiceAnswerAudioRef.current
    ) {

      result =
        await interviewService.submitVoiceAnswer(
          candidateId,
          currentQuestion.questionId,
          voiceAnswerAudioRef.current
        );

    }

    // =======================================================
    // TEXT ANSWER
    // =======================================================

    else {

      result =
        await interviewService.submitAnswer(
          candidateId,
          currentQuestion.questionId,
          finalAnswer
        );
    }


    // =======================================================
    // SAVE EVALUATION
    // =======================================================

    setEvaluation(result);


    // =======================================================
    // LAST QUESTION
    // =======================================================

    if (
      currentIndex ===
      questions.length - 1
    ) {

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300
          )
      );

      await finishInterview();

      return;
    }


    // =======================================================
    // NEXT QUESTION
    // =======================================================

    setCurrentIndex(
      (previous) =>
        previous + 1
    );

    setAnswer("");

    setEvaluation(null);

    // Clear previous voice recording
    voiceAnswerAudioRef.current = null;

    if (typeof setVoiceAnswerReady === "function") {
      setVoiceAnswerReady(false);
    }


  } catch (err) {

    console.error(
      "Failed to submit interview answer:",
      err
    );


    // =======================================================
    // DUPLICATE ANSWER
    // =======================================================

    if (
      err?.response?.data?.message?.includes(
        "already been submitted"
      )
    ) {

      if (
        currentIndex <
        questions.length - 1
      ) {

        setCurrentIndex(
          (previous) =>
            previous + 1
        );

        setAnswer("");

        setError("");

        voiceAnswerAudioRef.current = null;

        if (typeof setVoiceAnswerReady === "function") {
          setVoiceAnswerReady(false);
        }
      }

      return;
    }


    // =======================================================
    // OTHER ERROR
    // =======================================================

    setError(
      err?.response?.data?.message ||
        "Unable to submit your answer."
    );

  } finally {

    setSubmitting(false);
  }
};

  /*
  ============================================================
  FINISH INTERVIEW
  ============================================================
  */

  const finishInterview =
    async (
      automatic = false
    ) => {
      if (
        submitting &&
        !automatic
      ) {
        return;
      }

      try {
        setSubmitting(true);
        setError("");

        stopAISpeech();
const result =
  await interviewService.terminateInterview(
    candidateId,
    jobId,
    violationCountRef.current,
    violationMessage ||
      "Maximum number of security violations reached."
  );

        stopCamera();

        await exitFullscreen();

      navigate(
  `/candidate/interview-result?candidateId=${candidateId}&jobId=${jobId}`,
  {
    state: {
      result,
      automatic: true,
      violations: violationCountRef.current,
      securityTerminated: true,
    },
    replace: true,
  }
);

      } catch (err) {
        console.error(
          "Interview result error:",
          err
        );

        /*
         * If timer ended but backend result is not
         * immediately available, don't keep camera
         * and fullscreen active.
         */
        if (automatic) {
          stopCamera();

          await exitFullscreen();

          setStarted(false);

          setError(
            "Interview time has ended. Your submitted responses are being processed."
          );

          return;
        }

        setError(
          err?.response?.data?.message ||
            "Interview result is not ready yet."
        );

      } finally {
        setSubmitting(false);
      }
    };

  /*
  ============================================================
  NAVIGATE TO ANSWERED QUESTION
  ============================================================
  */

  const goToQuestion =
    (index) => {
      const selectedQuestion =
        questions[index];

      if (
        !selectedQuestion
      ) {
        return;
      }

      const savedAnswer =
        answers[
          selectedQuestion.questionId
        ];

      /*
       * Only answered questions can be revisited.
       */
      if (
        savedAnswer
      ) {
        setCurrentIndex(
          index
        );

        setAnswer(
          savedAnswer
        );

        setEvaluation(
          null
        );

        setError("");

        /*
         * Read question again.
         */
        if (
          voiceEnabled
        ) {
          setTimeout(() => {
            speakQuestion(
              selectedQuestion.question
            );
          }, 250);
        }
      }
    };

  /*
  ============================================================
  CLEANUP
  ============================================================
  */

  useEffect(() => {
    return () => {
      stopAISpeech();

      if (
        streamRef.current
      ) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        streamRef.current =
          null;
      }

      if (
        document.fullscreenElement
      ) {
        document.exitFullscreen()
          .catch(() => {});
      }

      if (
        warningTimeoutRef.current
      ) {
        clearTimeout(
          warningTimeoutRef.current
        );
      }

      if (
        speechRecognitionRef.current
      ) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // Ignore.
        }
      }
    };
  }, []);

  /*
  ============================================================
  FORMAT TIME
  ============================================================
  */

  const formatTime =
    (seconds) => {
      const minutes =
        Math.floor(
          seconds / 60
        );

      const remainingSeconds =
        seconds % 60;

      return `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        remainingSeconds
      ).padStart(
        2,
        "0"
      )}`;
    };

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return (
      <div className="interview-page">

        <div className="interview-loading">

          <Loader2
            className="assessment-loader"
            size={30}
          />

          <h2>
            Preparing your AI interview...
          </h2>

          <p>
            Checking your personalized
            interview questions.
          </p>

        </div>

      </div>
    );
  }

  /*
  ============================================================
  ERROR
  ============================================================
  */

  if (
    error &&
    !started
  ) {
    return (
      <div className="interview-page">

        <div className="interview-error">

          <AlertCircle
            size={40}
          />

          <h2>
            Unable to start interview
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() => {
              setError("");
              loadInterviewQuestions();
            }}
          >
            <RotateCcw
              size={16}
            />
            Try Again
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/candidate/assessments"
              )
            }
          >
            <ArrowLeft
              size={16}
            />
            Back to Assessments
          </button>

        </div>

      </div>
    );
  }

  /*
  ============================================================
  START SCREEN
  ============================================================
  */

  if (!started) {
    return (
      <div className="interview-page">

        <div className="interview-start">

          <div className="interview-start-icon">
            <ShieldCheck
              size={40}
            />
          </div>

          <span className="interview-eyebrow">
            AI INTERVIEW
          </span>

          <h1>
            Proctored AI Interview
          </h1>

          <p>
            Your interview will be conducted
            through an AI interviewer with
            voice interaction and text fallback.
          </p>

          <div className="interview-start-job">

            <Sparkles
              size={20}
            />

            <div>

              <span>
                Personalized Interview
              </span>

              <strong>
                Technical + HR + Skill Gap
              </strong>

            </div>

          </div>

          <div className="interview-info-grid">

            <div>

              <Video
                size={20}
              />

              <strong>
                10
              </strong>

              <span>
                Questions
              </span>

            </div>

            <div>

              <Clock3
                size={20}
              />

              <strong>
                20
              </strong>

              <span>
                Minutes
              </span>

            </div>

            <div>

              <Mic
                size={20}
              />

              <strong>
                VOICE
              </strong>

              <span>
                AI Interview
              </span>

            </div>

          </div>

          <div className="interview-instructions">

            <h3>
              Before you begin
            </h3>

            <ul>

              <li>
                Camera access is required.
              </li>

              <li>
                Fullscreen mode is required.
              </li>

              <li>
                The AI interviewer will
                speak each question.
              </li>

              <li>
                You can answer using
                voice or text.
              </li>

              <li>
                Voice answers are converted
                into text before evaluation.
              </li>

              <li>
                Copy, paste and restricted
                shortcuts are disabled.
              </li>

              <li>
                Three security violations
                terminate the interview.
              </li>

            </ul>

          </div>

          {cameraError && (
            <div className="camera-start-error">

              <AlertTriangle
                size={18}
              />

              <span>
                {cameraError}
              </span>

            </div>
          )}

          {error && (
            <div className="camera-start-error">

              <AlertTriangle
                size={18}
              />

              <span>
                {error}
              </span>

            </div>
          )}

          <button
            className="interview-start-button"
            onClick={
              startInterview
            }
            disabled={
              startingProctoring
            }
          >

            {startingProctoring ? (
              <>
                <Loader2
                  size={18}
                  className="button-spinner"
                />

                Starting secure interview...
              </>
            ) : (
              <>
                <ShieldCheck
                  size={18}
                />

                Start Proctored Interview

                <ArrowRight
                  size={18}
                />
              </>
            )}

          </button>

          <button
            className="interview-exit-button"
            onClick={() =>
              navigate(
                "/candidate/assessments"
              )
            }
            disabled={
              startingProctoring
            }
          >

            <ArrowLeft
              size={16}
            />

            Back to Assessments

          </button>

        </div>

      </div>
    );
  }

  /*
  ============================================================
  CURRENT QUESTION
  ============================================================
  */

  if (!currentQuestion) {
    return (
      <div className="interview-page">

        <div className="interview-loading">

          <Loader2
            className="assessment-loader"
            size={30}
          />

          <p>
            Loading interview question...
          </p>

        </div>

      </div>
    );
  }

  const progress =
    ((currentIndex + 1) /
      questions.length) *
    100;

  /*
  ============================================================
  MAIN PROCTORED INTERVIEW UI
  ============================================================
  */

  return (
    <div className="interview-page proctored-interview-page">

      {/* =====================================================
          VIOLATION WARNING
      ===================================================== */}

      {showViolationWarning && (
        <div className="proctor-warning">

          <ShieldCheck
            size={20}
          />

          <div>

            <strong>
              Interview Integrity Warning
            </strong>

            <span>
              {violationMessage}
            </span>

            <small>
              Violation{" "}
              {violations} of 3
            </small>

          </div>

        </div>
      )}

      {/* =====================================================
          FULLSCREEN WARNING
      ===================================================== */}

      {!fullscreenActive && (
        <div className="fullscreen-warning">

          <AlertTriangle
            size={17}
          />

          <span>
            Fullscreen mode is required.
          </span>

          <button
            onClick={
              enterFullscreen
            }
          >
            Return to Fullscreen
          </button>

        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="interview-session">

        <div className="interview-session-header">

          <div>

            <span className="interview-eyebrow">
              AI PROCTORED INTERVIEW
            </span>

            <h1>
              Technical + HR Interview
            </h1>

          </div>

          <div className="interview-session-security">

            <div className="interview-camera-mini">

              <span
                className={`camera-dot ${
                  cameraReady
                    ? "active"
                    : "inactive"
                }`}
              />

              {cameraReady
                ? "Camera Live"
                : "Camera Not Ready"}

            </div>

            <div
              className={`interview-timer ${
                timeLeft <= 60
                  ? "timer-warning"
                  : ""
              }`}
            >

              <Clock3
                size={18}
              />

              {formatTime(
                timeLeft
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="interview-progress-section">

          <div className="interview-progress-info">

            <span>
              Question{" "}
              {currentIndex + 1}{" "}
              of{" "}
              {questions.length}
            </span>

            <strong>
              {Math.round(
                progress
              )}
              %
            </strong>

          </div>

          <div className="interview-progress-bar">

            <div
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="ai-interview-workspace">

          {/* =================================================
              LEFT / MAIN
          ================================================= */}

          <main className="ai-interview-main">

            {/* AI ORB */}

            <section className="ai-interviewer-card">

              <div className="ai-interviewer-status">

                <span
                  className={`ai-status-dot ${
                    aiSpeaking
                      ? "speaking"
                      : ""
                  }`}
                />

                <span>
                  {aiSpeaking
                    ? "AI is speaking..."
                    : "AI Interviewer"}
                </span>

              </div>

             <AIInterviewerOrb
                state={
                  aiSpeaking
                    ? "speaking"
                    : "idle"
                }
              />

              <div className="ai-question-area">

                <span className="ai-question-label">
                  Question{" "}
                  {currentIndex + 1}
                </span>

                <h2>
                  {
                    currentQuestion.question
                  }
                </h2>

                <div className="ai-question-meta">

                  <span>
                    {
                      currentQuestion.type
                    }
                  </span>

                  <span>
                    {
                      currentQuestion.difficulty
                    }
                  </span>

                </div>

                <button
                  className="replay-question-button"
                  onClick={() =>
                    speakQuestion(
                      currentQuestion.question
                    )
                  }
                  disabled={
                    aiSpeaking ||
                    !voiceEnabled
                  }
                >

                  <Volume2
                    size={16}
                  />

                  Replay Question

                </button>

              </div>

            </section>

            {/* ANSWER MODE */}

            <section className="answer-mode-section">

              <div className="answer-mode-header">

                <div>

                  <span>
                    YOUR RESPONSE
                  </span>

                  <h3>
                    Choose how you want
                    to answer
                  </h3>

                </div>

                <button
                  className="voice-toggle-button"
                  onClick={() => {
                    setVoiceEnabled(
                      (previous) =>
                        !previous
                    );

                    if (
                      voiceEnabled
                    ) {
                      stopAISpeech();
                    }
                  }}
                >

                  {voiceEnabled ? (
                    <>
                      <Volume2
                        size={16}
                      />
                      Voice On
                    </>
                  ) : (
                    <>
                      <VolumeX
                        size={16}
                      />
                      Voice Off
                    </>
                  )}

                </button>

              </div>

              <div className="answer-mode-toggle">

                <button
                  className={
                    answerMode ===
                    "voice"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setAnswerMode(
                      "voice"
                    );

                    setError("");
                  }}
                >

                  <Mic
                    size={18}
                  />

                  Voice Answer

                </button>

                <button
                  className={
                    answerMode ===
                    "text"
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setAnswerMode(
                      "text"
                    );

                    setError("");
                  }}
                >

                  <PenLine
                    size={18}
                  />

                  Text Answer

                </button>

              </div>

              {/* VOICE MODE */}

              {answerMode ===
                "voice" && (
                <VoiceRecorder
                  onTranscript={
                    handleVoiceTranscript
                  }
                  onRecordingComplete={
                    handleVoiceRecordingComplete
                  }
                  disabled={
                    submitting ||
                    aiSpeaking
                  }
                />
              )}

              {/* TEXT MODE */}

              {answerMode ===
                "text" && (
                <TextAnswer
                  value={
                    answer
                  }
                  onChange={
                    setAnswer
                  }
                  disabled={
                    submitting
                  }
                />
              )}

              {/* CURRENT ANSWER PREVIEW */}

              {answer && (
                <div className="answer-preview">

                  <div className="answer-preview-header">

                    <span>
                      Your response
                    </span>

                    <CheckCircle2
                      size={17}
                    />

                  </div>

                  <p>
                    {answer}
                  </p>

                </div>
              )}

              {error && (
                <div className="interview-inline-error">

                  <AlertCircle
                    size={17}
                  />

                  {error}

                </div>
              )}

              {evaluation && (
                <div className="interview-evaluation">

                  <CheckCircle2
                    size={20}
                  />

                  <div>

                    <strong>
                      Answer Evaluated
                    </strong>

                    <span>
                      Score:{" "}
                      {
                        evaluation.score
                      }
                      /10
                    </span>

                    <p>
                      {
                        evaluation.feedback
                      }
                    </p>

                  </div>

                </div>
              )}

              {/* SUBMIT */}

              <div className="ai-answer-actions">

                <div className="response-security">

                  <ShieldCheck
                    size={17}
                  />

                  <span>
                    Response is securely
                    evaluated by AI
                  </span>

                </div>

               <button
                type="button"
  className="interview-submit-button"
  onClick={submitCurrentAnswer}
  disabled={
    submitting ||
    (
      answerMode === "text"
        ? !answer.trim()
        : !voiceAnswerAudioRef.current
    )
  }
>
  {submitting ? (
    <>
      <Loader2
        size={17}
        className="button-spinner"
      />

      Evaluating...
    </>
  ) : (
    <>
      {currentIndex === questions.length - 1
        ? "Finish Interview"
        : "Submit & Continue"}

      <Send size={17} />
    </>
  )}
</button>

              </div>

            </section>

          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="interview-proctor-sidebar">

            {/* CAMERA */}

            <div className="proctor-camera-card">

              <div className="proctor-camera-header">

                <div>

                  <ShieldCheck
                    size={16}
                  />

                  <strong>
                    Proctored
                  </strong>

                </div>

                <span className="camera-live-indicator">
                  LIVE
                </span>

              </div>

              <div className="camera-preview">

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="proctor-video"
                />

                {!cameraReady && (
                  <div className="camera-placeholder">

                    <Camera
                      size={30}
                    />

                    <strong>
                      {cameraStream
                        ? "Starting camera..."
                        : "Camera unavailable"}
                    </strong>

                    <span>
                      {cameraStream
                        ? "Please wait..."
                        : "Camera access required"}
                    </span>

                  </div>
                )}

              </div>

              <div className="camera-status">

                <span
                  className={`camera-dot ${
                    cameraReady
                      ? "active"
                      : "inactive"
                  }`}
                />

                <span>
                  {cameraReady
                    ? "Camera monitoring active"
                    : "Camera not ready"}
                </span>

              </div>

            </div>

            {/* SECURITY */}

            <div className="assessment-security-card">

              <ShieldCheck
                size={20}
              />

              <div>

                <strong>
                  Interview Integrity
                </strong>

                <p>
                  Camera monitoring,
                  fullscreen and
                  restricted actions
                  are active.
                </p>

                <small>
                  Violations:{" "}
                  {violations}/3
                </small>

              </div>

            </div>

            {/* QUESTION NAVIGATOR */}

            <div className="interview-question-navigator">

              <div className="proctor-sidebar-heading">

                <div>

                  <span>
                    INTERVIEW
                  </span>

                  <h3>
                    Question Navigator
                  </h3>

                </div>

              </div>

              <div className="interview-question-grid">

                {questions.map(
                  (
                    question,
                    index
                  ) => {

                    const answered =
                      !!answers[
                        question.questionId
                      ];

                    return (
                      <button
                        key={
                          question.questionId
                        }
                        disabled={
                          !answered &&
                          index !==
                            currentIndex
                        }
                        className={`${
                          index ===
                          currentIndex
                            ? "active"
                            : ""
                        } ${
                          answered
                            ? "answered"
                            : ""
                        }`}
                        onClick={() =>
                          goToQuestion(
                            index
                          )
                        }
                      >
                        {index + 1}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
};

export default Interview;
