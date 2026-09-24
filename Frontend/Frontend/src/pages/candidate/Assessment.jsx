import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Loader2,
  ShieldCheck,
  Sparkles,
  Camera,
  Maximize,
  AlertTriangle,
} from "lucide-react";

import assessmentService from "../../services/assessmentService";

const Assessment = () => {
  const { assessmentId: routeAssessmentId } =
    useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(
    () =>
      new URLSearchParams(location.search),
    [location.search]
  );

  const jobId = searchParams.get("jobId");
  const resumeId = searchParams.get("resumeId");

  /*
  ============================================================
  REFS
  ============================================================
  */

  const initializedRef = useRef(false);
  const autoSubmittedRef = useRef(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const violationCountRef = useRef(0);
  const warningTimeoutRef = useRef(null);

  /*
  ============================================================
  STATE
  ============================================================
  */

  const [assessment, setAssessment] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState({});

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  ============================================================
  PROCTORING STATE
  ============================================================
  */

  const [assessmentStarted, setAssessmentStarted] =
    useState(false);

  const [cameraStream, setCameraStream] =
    useState(null);

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [violations, setViolations] =
    useState(0);

  const [violationMessage, setViolationMessage] =
    useState("");

  const [showViolationWarning, setShowViolationWarning] =
    useState(false);

  const [fullscreenActive, setFullscreenActive] =
    useState(false);

  const [startingProctoring, setStartingProctoring] =
    useState(false);

  /*
  ============================================================
  INITIALIZE ASSESSMENT
  ============================================================
  */

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    initializeAssessment();
  }, []);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      setError("");

      let assessmentData;

      /*
      ----------------------------------------------------------
      EXISTING ASSESSMENT
      ----------------------------------------------------------
      */

      if (routeAssessmentId) {
        const assessments =
          await assessmentService.getMyAssessments();

        const existingAssessment =
          assessments.find(
            (item) =>
              Number(item.assessmentId) ===
              Number(routeAssessmentId)
          );

        if (!existingAssessment) {
          throw new Error(
            "Assessment not found or you are not authorized to access it."
          );
        }

        assessmentData =
          existingAssessment;
      }

      /*
      ----------------------------------------------------------
      JOB + RESUME FLOW
      ----------------------------------------------------------
      */

      else {
        if (!jobId || !resumeId) {
          throw new Error(
            "Assessment information is missing. Please start the assessment from your application."
          );
        }

        const assessments =
          await assessmentService.getMyAssessments();

        const existingAssessment =
          assessments.find(
            (item) =>
              Number(item.jobId) ===
                Number(jobId) &&
              Number(item.resumeId) ===
                Number(resumeId)
          );

        if (existingAssessment) {
          assessmentData =
            existingAssessment;
        } else {
          assessmentData =
            await assessmentService.createAssessment(
              Number(jobId),
              Number(resumeId)
            );
        }
      }

      setAssessment(assessmentData);

      const id =
        assessmentData.assessmentId;

      /*
      ----------------------------------------------------------
      GENERATE QUESTIONS
      ----------------------------------------------------------
      */

      await assessmentService.generateQuestions(
        id
      );

      /*
      ----------------------------------------------------------
      GET SAFE QUESTIONS
      ----------------------------------------------------------
      */

      const questionData =
        await assessmentService.getQuestions(
          id
        );

      if (
        !questionData ||
        questionData.length === 0
      ) {
        throw new Error(
          "No assessment questions found."
        );
      }

      setQuestions(questionData);

      /*
      ----------------------------------------------------------
      TIMER
      ----------------------------------------------------------
      */

      const durationMinutes =
        assessmentData.durationMinutes || 45;

      setTimeLeft(
        durationMinutes * 60
      );

    } catch (err) {
      console.error(
        "Assessment initialization error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load the assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  CAMERA
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
          "Camera is not supported by this browser."
        );
      }

      /*
       * Stop previous camera stream
       */

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        streamRef.current = null;
      }

      /*
       * Request camera
       */

      const stream =
        await navigator.mediaDevices.getUserMedia({
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
        });

      const videoTrack =
        stream.getVideoTracks()[0];

      if (!videoTrack) {
        throw new Error(
          "No camera video track available."
        );
      }

      console.log(
        "Camera track:",
        videoTrack.readyState,
        videoTrack.getSettings()
      );

      streamRef.current = stream;

      setCameraStream(stream);

      return true;

    } catch (error) {
      console.error(
        "Camera initialization failed:",
        error
      );

      setCameraReady(false);

      setCameraError(
        "Unable to access your camera. Please allow camera permission and try again."
      );

      return false;
    }
  };

  /*
  ============================================================
  ATTACH CAMERA TO VIDEO
  ============================================================
  IMPORTANT:
  Depend on BOTH cameraStream and assessmentStarted.
  This solves the:
  "Video element is not available yet"
  problem.
  ============================================================
  */

  useEffect(() => {
    if (
      !cameraStream ||
      !assessmentStarted
    ) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) {
      console.warn(
        "Video element is not available yet."
      );
      return;
    }

    console.log(
      "Attaching camera stream to video..."
    );

    video.srcObject =
      cameraStream;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    const startVideo = async () => {
      try {
        await video.play();

        console.log(
          "Camera video started successfully."
        );

        setCameraReady(true);

      } catch (error) {
        console.error(
          "Video playback failed:",
          error
        );

        setCameraReady(false);

        setCameraError(
          "Camera preview could not be started."
        );
      }
    };

    if (
      video.readyState >= 1
    ) {
      startVideo();
    } else {
      video.onloadedmetadata =
        startVideo;
    }

    return () => {
      video.onloadedmetadata = null;
    };

  }, [
    cameraStream,
    assessmentStarted,
  ]);

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
  START PROCTORED ASSESSMENT
  ============================================================
  */

  const startProctoredAssessment =
    async () => {

      if (startingProctoring) {
        return;
      }

      try {
        setStartingProctoring(true);
        setCameraError("");
        setError("");

        /*
        --------------------------------------------------------
        CAMERA
        --------------------------------------------------------
        */

        const cameraStarted =
          await startCamera();

        if (!cameraStarted) {
          return;
        }

        /*
        --------------------------------------------------------
        FULLSCREEN
        --------------------------------------------------------
        */

        const fullscreenStarted =
          await enterFullscreen();

        if (!fullscreenStarted) {

          setCameraError(
            "Fullscreen mode is required to start the assessment."
          );

          stopCamera();

          return;
        }

        /*
        --------------------------------------------------------
        START ASSESSMENT
        --------------------------------------------------------
        */

        setAssessmentStarted(true);

      } catch (err) {

        console.error(
          "Unable to start proctored assessment:",
          err
        );

        stopCamera();

        await exitFullscreen();

        setCameraError(
          "Unable to start secure assessment mode."
        );

      } finally {
        setStartingProctoring(false);
      }
    };

  /*
  ============================================================
  REGISTER VIOLATION
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

      setViolationMessage(
        message
      );

      setShowViolationWarning(
        true
      );

      if (
        warningTimeoutRef.current
      ) {
        clearTimeout(
          warningTimeoutRef.current
        );
      }

      warningTimeoutRef.current =
        setTimeout(() => {
          setShowViolationWarning(
            false
          );
        }, 3500);

      /*
      ----------------------------------------------------------
      AUTO SUBMIT
      ----------------------------------------------------------
      */

      if (count >= 3) {

        if (
          !autoSubmittedRef.current
        ) {
          autoSubmittedRef.current =
            true;

          handleSubmit(true);
        }
      }
    };

  /*
  ============================================================
  FULLSCREEN MONITOR
  ============================================================
  */

  useEffect(() => {

    if (!assessmentStarted) {
      return;
    }

    const handleFullscreenChange =
      () => {

        const active =
          !!document.fullscreenElement;

        setFullscreenActive(
          active
        );

        if (
          !active &&
          !submitting
        ) {
          registerViolation(
            "You exited fullscreen mode. Please remain in fullscreen during the assessment."
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
    assessmentStarted,
    submitting,
  ]);

  /*
  ============================================================
  COPY / PASTE / RIGHT CLICK
  ============================================================
  */

  useEffect(() => {

    if (!assessmentStarted) {
      return;
    }

    const preventCopyPaste =
      (event) => {

        event.preventDefault();

        registerViolation(
          "Copy, cut and paste actions are not allowed."
        );
      };

    const preventContextMenu =
      (event) => {

        event.preventDefault();

        registerViolation(
          "Right-click is not allowed during the assessment."
        );
      };

    document.addEventListener(
      "copy",
      preventCopyPaste
    );

    document.addEventListener(
      "cut",
      preventCopyPaste
    );

    document.addEventListener(
      "paste",
      preventCopyPaste
    );

    document.addEventListener(
      "contextmenu",
      preventContextMenu
    );

    return () => {

      document.removeEventListener(
        "copy",
        preventCopyPaste
      );

      document.removeEventListener(
        "cut",
        preventCopyPaste
      );

      document.removeEventListener(
        "paste",
        preventCopyPaste
      );

      document.removeEventListener(
        "contextmenu",
        preventContextMenu
      );
    };

  }, [
    assessmentStarted,
  ]);

  /*
  ============================================================
  KEYBOARD SHORTCUT MONITOR
  ============================================================
  */

  useEffect(() => {

    if (!assessmentStarted) {
      return;
    }

    const handleKeyboard =
      (event) => {

        const key =
          event.key.toLowerCase();

        /*
         * Screenshot key
         */

        if (
          key === "printscreen"
        ) {

          event.preventDefault();

          registerViolation(
            "Screenshot shortcut detected. Screenshots are not allowed during the assessment."
          );

          return;
        }

        /*
         * Restricted shortcuts
         */

        const blockedShortcut =
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          [
            "c",
            "v",
            "x",
            "a",
            "p",
            "s",
            "u",
          ].includes(key);

        /*
         * Developer tools
         */

        const devTools =
          key === "f12" ||
          (
            event.ctrlKey &&
            event.shiftKey &&
            ["i", "j", "c"].includes(key)
          );

        if (
          blockedShortcut ||
          devTools
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

  }, [
    assessmentStarted,
  ]);

  /*
  ============================================================
  VISIBILITY MONITOR
  ============================================================
  */

  useEffect(() => {

    if (!assessmentStarted) {
      return;
    }

    /*
     * IMPORTANT:
     * We intentionally do NOT use window.blur.
     * Browser focus can change for legitimate reasons.
     */

    const handleVisibilityChange =
      () => {

        if (
          document.hidden
        ) {

          registerViolation(
            "You left the assessment window."
          );
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };

  }, [
    assessmentStarted,
  ]);

  /*
  ============================================================
  BROWSER BACK BUTTON
  ============================================================
  */

  useEffect(() => {

    if (!assessmentStarted) {
      return;
    }

    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState =
      () => {

        window.history.pushState(
          null,
          "",
          window.location.href
        );

        registerViolation(
          "Navigation away from the assessment is not allowed."
        );
      };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };

  }, [
    assessmentStarted,
  ]);

  /*
  ============================================================
  CAMERA TRACK MONITOR
  ============================================================
  */

  useEffect(() => {

    if (
      !assessmentStarted ||
      !cameraStream
    ) {
      return;
    }

    const track =
      cameraStream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    const handleEnded =
      () => {

        setCameraReady(
          false
        );

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
    assessmentStarted,
    cameraStream,
  ]);

  /*
  ============================================================
  TIMER
  ============================================================
  */

  useEffect(() => {

    if (
      !assessmentStarted ||
      timeLeft === null ||
      submitting
    ) {
      return;
    }

    if (timeLeft <= 0) {

      if (
        !autoSubmittedRef.current
      ) {

        autoSubmittedRef.current =
          true;

        handleSubmit(true);
      }

      return;
    }

    const timer =
      setInterval(() => {

        setTimeLeft(
          (previous) =>
            previous !== null
              ? previous - 1
              : null
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [
    assessmentStarted,
    timeLeft,
    submitting,
  ]);

  /*
  ============================================================
  CLEANUP
  ============================================================
  */

  useEffect(() => {

    return () => {

      if (
        streamRef.current
      ) {

        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        streamRef.current = null;
      }

      if (
        document.fullscreenElement
      ) {

        document
          .exitFullscreen()
          .catch(() => {});
      }

      if (
        warningTimeoutRef.current
      ) {

        clearTimeout(
          warningTimeoutRef.current
        );
      }
    };

  }, []);

  /*
  ============================================================
  FORMAT TIMER
  ============================================================
  */

  const formatTime =
    (seconds) => {

      if (seconds === null) {
        return "--:--";
      }

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
  PARSE OPTIONS
  ============================================================
  */

  const parseOptions =
    (options) => {

      if (!options) {
        return [];
      }

      const parts =
        options
          .split("|")
          .map((item) =>
            item.trim()
          );

      const parsed = [];

      for (
        let i = 0;
        i < parts.length;
        i += 2
      ) {

        if (
          parts[i] &&
          parts[i + 1]
        ) {

          parsed.push({
            key: parts[i],
            text: parts[i + 1],
          });
        }
      }

      return parsed;
    };

  /*
  ============================================================
  ANSWER
  ============================================================
  */

  const selectAnswer =
    (questionId, answer) => {

      setAnswers(
        (previous) => ({
          ...previous,
          [questionId]:
            answer,
        })
      );
    };

  /*
  ============================================================
  NAVIGATION
  ============================================================
  */

  const goNext = () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        (previous) =>
          previous + 1
      );
    }
  };

  const goPrevious = () => {

    if (
      currentQuestion > 0
    ) {

      setCurrentQuestion(
        (previous) =>
          previous - 1
      );
    }
  };

  const goToQuestion =
    (index) => {

      setCurrentQuestion(
        index
      );
    };

  /*
  ============================================================
  SUBMIT
  ============================================================
  */

  const handleSubmit =
    async (automatic = false) => {

      if (submitting) {
        return;
      }

      if (!automatic) {

        const confirmed =
          window.confirm(
            "Are you sure you want to submit your assessment?"
          );

        if (!confirmed) {
          return;
        }
      }

      try {

        setSubmitting(true);
        setError("");

        const submittedAnswers =
          questions.map(
            (question) => ({
              questionId:
                question.questionId,

              answer:
                answers[
                  question.questionId
                ] || "",
            })
          );

        const result =
          await assessmentService.submitAssessment(
            assessment.assessmentId,
            submittedAnswers
          );

        stopCamera();

        await exitFullscreen();

        navigate(
          "/candidate/assessment-result",
          {
            state: {
              result,
              assessment,
              autoSubmitted:
                automatic,
              violations,
            },
            replace: true,
          }
        );

      } catch (err) {

        console.error(
          "Assessment submission error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to submit assessment."
        );

        setSubmitting(false);
      }
    };

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {

    return (
      <div className="assessment-loading-page">

        <div className="assessment-loading-card">

          <div className="assessment-loading-icon">
            <Sparkles size={24} />
          </div>

          <Loader2
            className="assessment-loader"
            size={28}
          />

          <h2>
            Preparing your assessment
          </h2>

          <p>
            Our AI engine is preparing
            questions based on the
            selected job.
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
    questions.length === 0
  ) {

    return (
      <div className="assessment-error-page">

        <div className="assessment-error-card">

          <div className="assessment-error-icon">
            <FileQuestion size={28} />
          </div>

          <h2>
            Unable to start assessment
          </h2>

          <p>
            {error}
          </p>

          <button
            className="assessment-secondary-btn"
            onClick={() =>
              navigate(
                "/candidate/applications"
              )
            }
          >
            <ArrowLeft size={16} />
            Back to Applications
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

  if (!assessmentStarted) {

    return (
      <div className="assessment-start-page">

        <div className="assessment-start-card">

          <div className="assessment-start-icon">
            <ShieldCheck size={38} />
          </div>

          <span className="assessment-start-eyebrow">
            AI RECRUITMENT ASSESSMENT
          </span>

          <h1>
            Proctored Technical Assessment
          </h1>

          <p className="assessment-start-description">
            This assessment uses camera
            monitoring and fullscreen mode
            to maintain assessment integrity.
          </p>

          <div className="proctor-requirements">

            <div>
              <Camera size={19} />
              <span>
                Camera access required
              </span>
            </div>

            <div>
              <Maximize size={19} />
              <span>
                Fullscreen mode required
              </span>
            </div>

            <div>
              <ShieldCheck size={19} />
              <span>
                Copy and paste restricted
              </span>
            </div>

            <div>
              <AlertTriangle size={19} />
              <span>
                3 violations will auto-submit
                the assessment
              </span>
            </div>

          </div>

          {cameraError && (
            <div className="camera-start-error">

              <AlertTriangle size={18} />

              <span>
                {cameraError}
              </span>

            </div>
          )}

          <button
            className="start-assessment-btn"
            onClick={
              startProctoredAssessment
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
                Starting secure mode...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Start Proctored Assessment
              </>
            )}

          </button>

          <button
            className="assessment-exit-btn"
            onClick={() =>
              navigate(
                "/candidate/applications"
              )
            }
            disabled={
              startingProctoring
            }
          >
            <ArrowLeft size={16} />
            Back to Applications
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

  const question =
    questions[currentQuestion];

  if (!question) {
    return null;
  }

  const options =
    parseOptions(
      question.options
    );

  const selectedAnswer =
    answers[
      question.questionId
    ];

  const answeredCount =
    Object.keys(
      answers
    ).filter(
      (questionId) =>
        answers[questionId] &&
        answers[questionId]
          .trim() !== ""
    ).length;

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  /*
  ============================================================
  UI
  ============================================================
  */

  return (
    <div className="assessment-page">

      {/* ====================================================
          VIOLATION WARNING
      ==================================================== */}

      {showViolationWarning && (
        <div className="proctor-warning">

          <ShieldCheck size={19} />

          <div>

            <strong>
              Assessment Integrity Warning
            </strong>

            <span>
              {violationMessage}
            </span>

            <small>
              Violation {violations} of 3
            </small>

          </div>

        </div>
      )}

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="assessment-header">

        <div className="assessment-header-left">

          <div>

            <div className="assessment-eyebrow">
              AI RECRUITMENT ASSESSMENT
            </div>

            <h1>
              Technical Assessment
            </h1>

          </div>

        </div>

        <div className="assessment-header-right">

          <div className="assessment-progress-info">

            <span>
              Progress
            </span>

            <strong>
              {answeredCount}/
              {questions.length}
            </strong>

          </div>

          <div
            className={`assessment-timer ${
              timeLeft !== null &&
              timeLeft <= 300
                ? "warning"
                : ""
            }`}
          >

            <Clock3 size={17} />

            <div>

              <span>
                Time remaining
              </span>

              <strong>
                {formatTime(
                  timeLeft
                )}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================
          FULLSCREEN WARNING
      ==================================================== */}

      {!fullscreenActive && (
        <div className="fullscreen-warning">

          <AlertTriangle size={17} />

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

      {/* ====================================================
          PROGRESS
      ==================================================== */}

      <div className="assessment-progress-bar">

        <div
          className="assessment-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* ====================================================
          MAIN
      ==================================================== */}

      <div className="assessment-content">

        {/* ==================================================
            QUESTION
        ================================================== */}

        <main className="assessment-question-section">

          <div className="assessment-question-card">

            <div className="question-top-row">

              <div className="question-number">

                Question{" "}
                {currentQuestion + 1}

                <span>
                  of{" "}
                  {questions.length}
                </span>

              </div>

              <div className="question-tags">

                {question.topic && (
                  <span className="question-topic">
                    {question.topic}
                  </span>
                )}

                {question.difficulty && (
                  <span
                    className={`question-difficulty ${question.difficulty.toLowerCase()}`}
                  >
                    {
                      question.difficulty
                    }
                  </span>
                )}

              </div>

            </div>

            <h2 className="question-text">
              {
                question.questionText
              }
            </h2>

            <div className="options-list">

              {options.map(
                (option) => {

                  const isSelected =
                    selectedAnswer ===
                    option.key;

                  return (
                    <button
                      key={
                        option.key
                      }
                      type="button"
                      className={`assessment-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectAnswer(
                          question.questionId,
                          option.key
                        )
                      }
                    >

                      <span className="option-letter">
                        {
                          option.key
                        }
                      </span>

                      <span className="option-text">
                        {
                          option.text
                        }
                      </span>

                      {isSelected && (
                        <CheckCircle2
                          size={20}
                          className="option-check"
                        />
                      )}

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {error && (
            <div className="assessment-submit-error">
              {error}
            </div>
          )}

          <div className="assessment-navigation">

            <button
              className="assessment-secondary-btn"
              disabled={
                currentQuestion === 0
              }
              onClick={
                goPrevious
              }
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {currentQuestion ===
            questions.length - 1 ? (

              <button
                className="assessment-submit-btn"
                disabled={
                  submitting
                }
                onClick={() =>
                  handleSubmit(
                    false
                  )
                }
              >

                {submitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="button-spinner"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <CheckCircle2
                      size={17}
                    />
                  </>
                )}

              </button>

            ) : (

              <button
                className="assessment-next-btn"
                onClick={
                  goNext
                }
              >
                Next Question
                <ArrowRight
                  size={17}
                />
              </button>

            )}

          </div>

        </main>

        {/* ==================================================
            RIGHT SIDEBAR
        ================================================== */}

        <aside className="assessment-sidebar">

          {/* =================================================
              CAMERA
          ================================================= */}

          <div className="proctor-camera-card">

            <div className="proctor-camera-header">

              <div>

                <ShieldCheck size={16} />

                <strong>
                  Proctored
                </strong>

              </div>

              <span className="camera-live-indicator">
                LIVE
              </span>

            </div>

            {/* IMPORTANT:
                ONLY ONE VIDEO ELEMENT
            */}

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

                  <Camera size={30} />

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

          {/* =================================================
              QUESTION NAVIGATOR
          ================================================= */}

          <div className="assessment-sidebar-card">

            <div className="assessment-sidebar-heading">

              <div>

                <span>
                  Assessment
                </span>

                <h3>
                  Question Navigator
                </h3>

              </div>

              <FileQuestion
                size={20}
              />

            </div>

            <div className="question-legend">

              <span>
                <i className="legend-current" />
                Current
              </span>

              <span>
                <i className="legend-answered" />
                Answered
              </span>

              <span>
                <i className="legend-unanswered" />
                Unanswered
              </span>

            </div>

            <div className="question-palette">

              {questions.map(
                (item, index) => {

                  const answered =
                    !!answers[
                      item.questionId
                    ];

                  const current =
                    index ===
                    currentQuestion;

                  return (
                    <button
                      key={
                        item.questionId
                      }
                      className={`palette-number ${
                        current
                          ? "current"
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

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="assessment-security-card">

            <ShieldCheck
              size={20}
            />

            <div>

              <strong>
                Assessment Integrity
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

        </aside>

      </div>

    </div>
  );
};

export default Assessment;