using {guipup} from '../db/data-model';

service CatalogService @(path: '/CatalogService') {
    entity products as projection on guipup.product;
}
