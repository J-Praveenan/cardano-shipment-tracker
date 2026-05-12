use cardano/transaction.{Transaction}
use types/shipment_datum.{ShipmentDatum}
use helper/is_signed_by.{is_signed_by}

pub fn validate_create(self: Transaction, datum: ShipmentDatum) -> Bool {
    is_signed_by(self, datum.sender)
}