// 提现记录
export const withdrawals = [
  {
    id: 'W001',
    amount: 5000.00,
    status: 'pending',       // pending / approved / rejected
    statusText: '待审核',
    account: '招商银行(6225****8866)',
    applyTime: '2026-07-11 08:30',
    reviewTime: '',
    rejectReason: ''
  },
  {
    id: 'W002',
    amount: 3000.00,
    status: 'pending',
    statusText: '待审核',
    account: '招商银行(6225****8866)',
    applyTime: '2026-07-10 14:00',
    reviewTime: '',
    rejectReason: ''
  },
  {
    id: 'W003',
    amount: 8000.00,
    status: 'approved',
    statusText: '已通过',
    account: '招商银行(6225****8866)',
    applyTime: '2026-07-05 10:15',
    reviewTime: '2026-07-05 16:30',
    rejectReason: ''
  },
  {
    id: 'W004',
    amount: 5200.00,
    status: 'rejected',
    statusText: '已驳回',
    account: '建设银行(6217****2255)',
    applyTime: '2026-07-03 09:00',
    reviewTime: '2026-07-03 14:20',
    rejectReason: '银行账户信息不完整，请核实后重新提交'
  },
  {
    id: 'W005',
    amount: 10000.00,
    status: 'approved',
    statusText: '已通过',
    account: '招商银行(6225****8866)',
    applyTime: '2026-06-28 11:30',
    reviewTime: '2026-06-28 15:00',
    rejectReason: ''
  },
  {
    id: 'W006',
    amount: 6500.00,
    status: 'approved',
    statusText: '已通过',
    account: '招商银行(6225****8866)',
    applyTime: '2026-06-20 14:45',
    reviewTime: '2026-06-20 17:30',
    rejectReason: ''
  }
]
