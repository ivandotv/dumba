export function DisplayErrors({ errors }: { errors: string[] }) {
  return (
    <>
      {errors.map((error) => (
        <>
          <span>{error}</span>
          <br />
        </>
      ))}
    </>
  )
}
