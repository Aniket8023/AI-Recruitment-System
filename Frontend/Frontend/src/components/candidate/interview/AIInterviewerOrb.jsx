import {
  Bot,
  Mic,
  Volume2,
  Brain,
} from "lucide-react";

const AIInterviewerOrb = ({
  state = "idle",
  question = "",
  onReplay,
}) => {
  const stateConfig = {
    idle: {
      label: "AI Interviewer",
      subLabel: "Ready for your response",
      icon: <Bot size={34} />,
    },

    speaking: {
      label: "AI Interviewer",
      subLabel: "AI is asking the question...",
      icon: <Volume2 size={34} />,
    },

    listening: {
      label: "Your turn",
      subLabel: "AI is listening...",
      icon: <Mic size={34} />,
    },

    evaluating: {
      label: "Evaluating response",
      subLabel: "AI is analyzing your answer...",
      icon: <Brain size={34} />,
    },

    completed: {
      label: "Response evaluated",
      subLabel: "Moving to the next question...",
      icon: <Bot size={34} />,
    },
  };

  const currentState =
    stateConfig[state] || stateConfig.idle;

  return (
    <div className={`ai-interviewer ${state}`}>

      {/* Orb */}

      <div className="ai-orb-wrapper">

        <div className="ai-orb-ring ring-one" />
        <div className="ai-orb-ring ring-two" />

        <div className="ai-orb">

          <div className="ai-orb-glow" />

          <div className="ai-orb-icon">
            {currentState.icon}
          </div>

        </div>

        {state === "speaking" && (
          <div className="ai-sound-waves">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {state === "listening" && (
          <div className="ai-listening-pulse" />
        )}

      </div>

      {/* Status */}

      <div className="ai-interviewer-status">

        <span className="ai-status-label">
          {currentState.label}
        </span>

        <span className="ai-status-description">
          {currentState.subLabel}
        </span>

      </div>

      {/* Question */}

      {question && (
        <div className="ai-question-container">

          <div className="ai-question-label">
            <span>AI QUESTION</span>

            {onReplay && (
              <button
                type="button"
                className="ai-replay-button"
                onClick={onReplay}
                disabled={
                  state === "evaluating"
                }
              >
                <Volume2 size={15} />
                Replay
              </button>
            )}
          </div>

          <p className="ai-question-text">
            {question}
          </p>

        </div>
      )}

    </div>
  );
};

export default AIInterviewerOrb;