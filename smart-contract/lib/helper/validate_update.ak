use aiken/collection/list
use cardano/transaction.{Transaction, InlineDatum}
use types/shipment_datum.{ShipmentDatum, Started, InTransit}
use helper/is_signed_by.{is_signed_by}

pub fn validate_update(
    self: Transaction, 
    datum: ShipmentDatum, 
    new_location: ByteArray, 
    _update_time: Int ) -> Bool {

    let valid_sign = is_signed_by(self, datum.sender)

    expect Some(output) = list.head(self.outputs)
    expect InlineDatum(raw_datum) = output.datum
    expect new_datum: ShipmentDatum = raw_datum

    let valid_status =  when datum.status is{
        Started -> new_datum.status == InTransit
        InTransit -> new_datum.status == InTransit
        _ -> False
    }

    let valid_location = new_datum.location == new_location

    and {
        valid_sign,
        valid_status,
        valid_location
    }

}

