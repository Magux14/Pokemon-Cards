export class PokemonExampleListModel {
    results: Array<PokemonExampleItemModel>;
}

export class PokemonExampleItemModel {
    name: string;
    url: string;
}

export class PokemonExampleDetail {
    sprites: PokemonExampleDetailSprites;
    types: string[];
}

export class PokemonExampleDetailSprites {
    front_default: string;
}

// Esta la mostraremos en la vista.
export class PokemonExampleFinalModel {
    name: string;
    imgUri?: string;
    detailtUrl: string;
    types: string[];
}