export function DisplayErrors({ errors }: { errors: string[] }) {
  return (
    <>
      {errors.map((error) => (
        <span key={error}>
          <span>{error}</span>
          <br />
        </span>
      ))}
    </>
  )
}
