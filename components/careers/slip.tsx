// The commission slip on a commission-paid role's sheet (a role with
// `commissionSlip` in lib/careers.ts): how the money moves, as a thermal till
// receipt lying on the sheet. It prints line by line when it scrolls into
// view and ends in a "Paid" stamp (./motion.tsx); with reduced motion it shows
// fully printed. No figures anywhere: rates are agreed in writing.

const LINES = [
  { item: "Introduced", val: "Logged to you" },
  { item: "Signed", val: "✓" },
  { item: "Client pays", val: "Received" },
  { item: "Commission", val: "Paid ≤7 days" },
];

export default function Slip() {
  return (
    <div className="cr-receipt" aria-hidden="true">
      <div className="cr-slip" data-cr-slip>
        <p className="cr-slip-head">
          <b>Ankora Labs</b>
          <span>Commission slip</span>
        </p>
        <p className="cr-slip-rule" />
        {LINES.map((l, i) => (
          <p key={l.item} className="cr-slip-row" data-cr-line>
            <span>
              0{i + 1} {l.item}
            </span>
            <i />
            <span>{l.val}</span>
          </p>
        ))}
        <p className="cr-slip-rule" />
        <p className="cr-slip-row cr-slip-small">
          <span>Rate</span>
          <i />
          <span>Agreed in writing</span>
        </p>
        <p className="cr-slip-row cr-slip-small">
          <span>Targets</span>
          <i />
          <span>None</span>
        </p>
        <span className="cr-slip-bar" />
        <p className="cr-slip-thanks">** Thank you **</p>
        <span className="cr-paid-stamp" data-cr-stamp>
          Paid
        </span>
      </div>
    </div>
  );
}
