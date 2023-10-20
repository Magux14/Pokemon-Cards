import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericWebResponseModel } from '../shared-models/generic-web-response.model';
import { FriendlyAddress, GoogleMapsPlaceAutocomplete, GoogleMapsPlaceComplete } from '../shared-models/google-maps-places.model';
import { NETWORK } from '../namespaces/network.namespace';
import { WebRestService } from './web-rest.service';
declare var google;

@Injectable()
export class GoogleMapsService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private webRestService: WebRestService
    ) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Llena una lista de strings, con direcciones que google maps puede transofrmar a coordenadas.
    public async searchAddress(strSearch: string): Promise<Array<GoogleMapsPlaceAutocomplete>> {
        if (!strSearch) {
            return [];
        }

        if (!NETWORK.hasInternet()) {
            return [];
        }

        const autoComplete = new google.maps.places.AutocompleteService();
        const options = {
            input: strSearch,
            componentRestrictions: { country: 'mx' },
            fields: ['address_components'],
        };

        return new Promise(resolve => {
            autoComplete.getPlacePredictions(options, async (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    return resolve(results.filter(item => item.description != null && item.place_id) || []);
                } else {
                    return resolve([]);
                }
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getCompleteGoogleMapsPlaceInfo(placeId: string): Promise<GoogleMapsPlaceComplete> {
        if (!NETWORK.hasInternet()) {
            return null;
        }

        const geocoder = new google.maps.Geocoder();
        return new Promise(resolve => {
            geocoder.geocode({ placeId }, (responses, status) => {
                if (status === 'OK' && responses.length > 0) {
                    return resolve(responses[0]);
                } else {
                    return resolve(null);
                }
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public getFrieldyAddress(googleMapsPlaceComplete: GoogleMapsPlaceComplete, options = {
        latLngAsFunction: true
    }): FriendlyAddress {
        return {
            latLng: {
                lat: (options.latLngAsFunction ? googleMapsPlaceComplete.geometry?.location?.lat() :
                    googleMapsPlaceComplete.geometry?.location?.lat),
                lng: (options.latLngAsFunction ? googleMapsPlaceComplete.geometry?.location?.lng() :
                    googleMapsPlaceComplete.geometry?.location?.lng),
            },
            fullAddress: googleMapsPlaceComplete.formatted_address,
            route: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'route'))?.long_name || '',
            routeNumber: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'street_number'))?.long_name || '',
            sublocality: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'sublocality'))?.long_name || '',
            locality: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'locality'))?.long_name || '',
            state: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'administrative_area_level_1'))?.long_name || '',
            postalCode: googleMapsPlaceComplete.address_components.find(item =>
                item.types.find(itemChild => itemChild === 'postal_code'))?.long_name || '',
        };
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async reverseGeocoding(lat: number, lng: number): Promise<FriendlyAddress> {
        if (!NETWORK.hasInternet()) {
            return null;
        }
        return new Promise<any>(async (resolve) => {
            const url = environment.url.googleMapsReverseGeocoding + '?latlng=' + lat + ',' + lng + '&key=' + environment.googleMapsApikey;
            const resp: GenericWebResponseModel = await this.webRestService.getAsync(url);
            if (!resp.success || !resp.data || !resp.data.results || resp.data.results.length === 0) {
                return resolve(null);
            }

            const googleMapsPlaceComplete: GoogleMapsPlaceComplete = resp.data.results[0];
            console.log('googleMapsPlaceComplete');
            console.log(googleMapsPlaceComplete);
            return resolve(this.getFrieldyAddress(googleMapsPlaceComplete, {
                latLngAsFunction: false
            }));

        });
    }
}
