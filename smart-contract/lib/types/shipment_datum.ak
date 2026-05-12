use cardano/address.{Credential}

pub type ShipmentStatus{
    Created
    Started
    InTransit
    Delivered
}

pub type ShipmentDatum{
    sender: Credential,
    receiver: Credential,
    name: ByteArray,
    price: Int,
    status: ShipmentStatus,
    location: ByteArray,
    updated_time: Int,
}