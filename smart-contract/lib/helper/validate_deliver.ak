use aiken/collection/list
use cardano/transaction.{InlineDatum, Transaction}
use helper/is_signed_by.{is_signed_by}
use types/shipment_datum.{Delivered, InTransit, ShipmentDatum}

pub fn validate_deliver(self: Transaction, datum: ShipmentDatum) -> Bool {
  let valid_sign = is_signed_by(self, datum.receiver)

  expect Some(output) = list.head(self.outputs)
  expect InlineDatum(raw_datum) = output.datum
  expect new_datum: ShipmentDatum = raw_datum

  let valid_old_status = datum.status == InTransit
  let valid_new_status = new_datum.status == Delivered

  and {
    valid_sign,
    valid_old_status,
    valid_new_status,
  }
}
