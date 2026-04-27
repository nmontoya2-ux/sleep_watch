function NapBadge({ minutes }) {
  return (
    <span className="nap-badge">
      {minutes > 0 ? `${minutes} min naps included` : 'No naps logged'}
    </span>
  )
}

export default NapBadge
