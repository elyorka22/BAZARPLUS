-- Add courier_notes field to orders table for delivery instructions
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS courier_notes TEXT;

-- Add comment to the column
COMMENT ON COLUMN orders.courier_notes IS 'Kurier uchun izoh (orientir) - delivery instructions for courier';

