export interface GoogleMapsPlaceAutocomplete {
    description: string;
    matched_substrings: MatchedSubstring[];
    place_id: string;
    reference: string;
    structured_formatting: StructuredFormatting;
    terms: Term[];
    types: string[];
}

export interface MatchedSubstring {
    length: number;
    offset: number;
}

export interface StructuredFormatting {
    main_text: string;
    main_text_matched_substrings: MatchedSubstring[];
    secondary_text: string;
}

export interface Term {
    offset: number;
    value: string;
}

export class LatLng {
    lat: number;
    lng: number;
}


//--------------------
export interface GoogleMapsPlaceComplete {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    plus_code: PlusCode;
    types: string[];
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Geometry {
    location: Location;
    location_type: string;
    viewport: Viewport;
}

export interface Location {
    lat: Function;
    lng: Function;
}

export interface Viewport {
    south: number;
    west: number;
    north: number;
    east: number;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface FriendlyAddress {
    latLng: LatLng;
    fullAddress: string;
    route: string;
    routeNumber: string;
    sublocality: string;
    locality: string;
    state: string;
    postalCode: string;
}