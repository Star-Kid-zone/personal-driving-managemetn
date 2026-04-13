<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'DejaVu Sans', sans-serif; font-size:13px; color:#1a1a2e; background:#fff; }
  .page { padding:40px; max-width:800px; margin:0 auto; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; border-bottom:3px solid #000666; padding-bottom:20px; }
  .logo-area h1 { font-size:26px; font-weight:800; color:#000666; }
  .logo-area p { color:#4F4F4F; font-size:11px; }
  .invoice-meta { text-align:right; }
  .invoice-meta h2 { font-size:20px; color:#D4AF37; font-weight:700; }
  .invoice-meta p { font-size:11px; color:#666; }
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; }
  .badge-paid { background:#d1fae5; color:#065f46; }
  .badge-partial { background:#fef3c7; color:#92400e; }
  .badge-pending { background:#fee2e2; color:#991b1b; }
  .section { margin:20px 0; }
  .two-col { display:flex; gap:20px; }
  .col { flex:1; background:#f8f9ff; border:1px solid #e0e0f0; border-radius:8px; padding:16px; }
  .col h4 { font-size:10px; text-transform:uppercase; color:#888; letter-spacing:1px; margin-bottom:8px; }
  .col p { font-size:13px; color:#1a1a2e; line-height:1.6; }
  table { width:100%; border-collapse:collapse; margin:20px 0; }
  thead th { background:#000666; color:#fff; padding:10px 14px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; }
  tbody td { padding:10px 14px; border-bottom:1px solid #eee; }
  tbody tr:last-child td { border-bottom:none; }
  .totals { margin-left:auto; width:280px; }
  .totals table { margin:0; }
  .totals td { padding:6px 10px; }
  .totals .grand-total td { background:#000666; color:#fff; font-weight:700; font-size:14px; }
  .footer { margin-top:40px; padding-top:16px; border-top:1px solid #eee; text-align:center; color:#888; font-size:10px; }
  .highlight { color:#D4AF37; font-weight:700; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo-area">
      <h1>DriveMaster</h1>
      <p>Professional Driving School</p>
      <p>Tamil Nadu, India | GST: 33XXXXX0000X1Z5</p>
      <p>+91 98765 43210 | admin@drivemaster.in</p>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p class="highlight">{{ $invoice->invoice_number }}</p>
      <p>Date: {{ $invoice->invoice_date->format('d M Y') }}</p>
      @if($invoice->due_date)
      <p>Due: {{ $invoice->due_date->format('d M Y') }}</p>
      @endif
      <br/>
      <span class="badge badge-{{ $invoice->status === 'paid' ? 'paid' : ($invoice->status === 'partial' ? 'partial' : 'pending') }}">
        {{ strtoupper($invoice->status) }}
      </span>
    </div>
  </div>

  <div class="two-col">
    <div class="col">
      <h4>Bill To</h4>
      <p><strong>{{ $student->name }}</strong></p>
      <p>ID: {{ $student->student_id }}</p>
      <p>{{ $student->phone }}</p>
      <p>{{ $student->address }}</p>
    </div>
    <div class="col">
      <h4>Course Details</h4>
      <p><strong>{{ ucfirst($student->vehicle_type) }} Driving</strong></p>
      <p>Sessions: {{ $student->completed_sessions }} / {{ $student->total_sessions }}</p>
      <p>Enrolled: {{ $student->enrollment_date->format('d M Y') }}</p>
      <p>Instructor: {{ $student->teacher?->user?->name ?? 'N/A' }}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th style="text-align:right">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      @foreach($invoice->line_items ?? [] as $i => $item)
      <tr>
        <td>{{ $i + 1 }}</td>
        <td>{{ $item['description'] }}</td>
        <td style="text-align:right">{{ number_format($item['amount'], 2) }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td style="text-align:right">₹{{ number_format($invoice->subtotal, 2) }}</td></tr>
      @if($invoice->discount > 0)
      <tr><td>Discount</td><td style="text-align:right; color:green">-₹{{ number_format($invoice->discount, 2) }}</td></tr>
      @endif
      <tr><td>Tax (GST)</td><td style="text-align:right">₹{{ number_format($invoice->tax, 2) }}</td></tr>
      <tr class="grand-total"><td>Total</td><td style="text-align:right">₹{{ number_format($invoice->total, 2) }}</td></tr>
      <tr><td>Amount Paid</td><td style="text-align:right; color:green">₹{{ number_format($invoice->amount_paid, 2) }}</td></tr>
      <tr><td><strong>Balance Due</strong></td><td style="text-align:right; color:red"><strong>₹{{ number_format($invoice->balance, 2) }}</strong></td></tr>
    </table>
  </div>

  <div class="footer">
    <p>Thank you for choosing DriveMaster! Safe driving is our priority.</p>
    <p>This is a computer-generated invoice. For queries, contact admin@drivemaster.in</p>
  </div>
</div>
</body>
</html>
