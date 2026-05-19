type CapabilityTagProps = {
  label: string
}

export function CapabilityTag({ label }: CapabilityTagProps) {
  return <span className="capability-tag">{label}</span>
}
