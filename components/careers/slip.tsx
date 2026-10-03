// The commission slip on a commission-paid role's sheet (a role with
// `commissionSlip` in lib/careers.ts): how the money moves, printed as a till
// receipt under a printer slot. It prints line by line when it scrolls into
// view and ends in a "Paid" stamp (./motion.tsx); with reduced motion it shows
// fully printed. No figures anywhere: rates are agreed in writing.

const LINES = [
  { item: "You introduce", val: "Logged to you" },
  { item: "Client signs", val: "✓" },
  { item: "Client pays us", val: "Received" },
  { item: "Your commission", val: "Paid ≤ 7 days" },
];

export default function Slip() {
  return (
    <div className="cr-printer" aria-hidden="true">
      <span className="cr-slot" />
      <div className="cr-slip-clip">
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
          <span className="cr-paid-stamp" data-cr-stamp>
            Paid
          </span>
        </div>
      </div>
    </div>
  );
}
