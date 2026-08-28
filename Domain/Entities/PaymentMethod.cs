using System.Collections.Generic;

namespace Domain.Entities
{
    public class PaymentMethod
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public IList<Payment> Payments { get; set; } = new List<Payment>();
    }
}
