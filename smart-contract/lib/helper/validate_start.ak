use aiken/collection/list
use cardano/transaction.{Transaction, InlineDatum}
use types/shipment_datum.{ShipmentDatum, Created, Started}
use helper/is_signed_by.{is_signed_by}

pub fn validate_start(self: Transaction, datum: ShipmentDatum) -> Bool{

    let valid_sign = is_signed_by(self, datum.sender)

    expect Some(output) = list.head(self.outputs)
    expect InlineDatum(raw_datum) = output.datum
    expect new_datum: ShipmentDatum = raw_datum

    let valid_old_status = datum.status == Created
    let valid_new_status = new_datum.status == Started

    and {
        valid_sign,
        valid_old_status,
        valid_new_status
    }
}