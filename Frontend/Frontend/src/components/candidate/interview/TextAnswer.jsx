import {
  Send,
  PenLine,
} from "lucide-react";

const TextAnswer = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) => {

  return (
    <div className="text-answer">

      <div className="text-answer-header">

        <div>
          <PenLine size={18} />

          <div>
            <strong>
              Written Response
            </strong>

            <span>
              Type your answer below
            </span>
          </div>
        </div>

        <span className="text-answer-count">
          {value?.length || 0}
        </span>

      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder="Type your answer here..."
        disabled={disabled}
        rows={7}
      />

      <div className="text-answer-footer">

        <span>
          Explain your answer clearly
          and concisely.
        </span>

        <button
          type="button"
          className="text-answer-submit"
          onClick={onSubmit}
          disabled={
            disabled ||
            !value?.trim()
          }
        >
          Submit Answer
          <Send size={16} />
        </button>

      </div>

    </div>
  );
};

export default TextAnswer;