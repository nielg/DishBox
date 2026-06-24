type Props = {
  onSubmit: () => Promise<void>;
};

export default function AddRecipePreview({ onSubmit }: Props) {
  return (
    <>
      <div className="text-align-center">
        <h2>Preview</h2>
        <p>Make sure everything is correct</p>
        <button onClick={() => onSubmit()}>Submit</button>
      </div>
    </>
  );
}
