namespace Domain.Entities
{
    public class Payment
    {
        public Guid PaymentId { get; set; }
        public DateTime Date { get; set; }
        public string Amount { get; set; } = string.Empty;

        public PaymentMethod PaymentMethod { get; set; } = null!;
        public int PaymentMethodId { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = null!;
        public int PaymentStatusId { get; set; }
    }
}
