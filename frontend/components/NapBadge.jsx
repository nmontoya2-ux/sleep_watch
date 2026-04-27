function NapBadge({ minutes }) {
  if (!minutes) {
    return (
      <span className="tag">
        <i />
        No naps logged
      </span>
    )
  }
  return (
    <span className="tag tag-accent">
      <i />
      Includes {minutes} min nap
    </span>
  )
}

export default NapBadge
