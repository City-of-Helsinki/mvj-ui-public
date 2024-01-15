import { MapContainer } from 'react-leaflet';
import 'proj4leaflet';

import { PlotSearch } from '../plotSearch/types';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from './mapSearchPage';
import MapPlotSearchOverlay from './mapPlotSearchOverlay';
import {
  attachMapResizeObserver,
  HELSINKI_CENTRAL_COORDINATES,
  initializeHelsinkiMap,
} from '../map/utils';
import { Favourite } from '../favourites/types';
import { StandardMapLayersControl } from '../map/StandardMapLayersControl';
import { MapLayer } from '../map/types';
import ZoomControl from '../map/ZoomControl';
import MapReadyHandler from '../map/MapReadyHandler';

interface Props {
  plotSearches: Array<PlotSearch>;
  setSelectedTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  categoryOptions: CategoryOptions;
  categoryVisibilities: CategoryVisibilities;
  favourite: Favourite;
  hoveredTargetId: number | null;
  setHoveredTargetId: (id: number | null) => void;
}

const MapComponent = (props: Props): JSX.Element => {
  // Initializing map settings
  const initialPosition = HELSINKI_CENTRAL_COORDINATES;
  const { latLonBounds, CRS } = initializeHelsinkiMap();

  // Initializing other component variables

  const plotSearchesByCategory = props.categoryOptions.map((category) => ({
    category,
    plotSearches: props.plotSearches?.filter(
      (plotSearch) => plotSearch.type?.id === category.id,
    ),
  }));

  return (
    <MapContainer
      className="MapComponent"
      center={initialPosition}
      zoom={6}
      scrollWheelZoom={true}
      maxBounds={latLonBounds}
      bounds={latLonBounds}
      minZoom={2}
      maxZoom={12}
      crs={CRS}
      zoomControl={false}
    >
      <MapReadyHandler whenCreated={attachMapResizeObserver} />
      <StandardMapLayersControl
        enabledLayers={[
          MapLayer.generalMap,
          MapLayer.orthographic,
          MapLayer.cityPlan,
        ]}
      />
      <ZoomControl />
      {plotSearchesByCategory.map(
        (item, index) =>
          props.categoryVisibilities[item.category.id] &&
          item.plotSearches.map((plotSearch) => {
            if (
              props.favourite.targets.length <= 0 ||
              plotSearch.id === props.favourite.targets[0].plot_search
            ) {
              return (
                <MapPlotSearchOverlay
                  plotSearchTargets={plotSearch.plot_search_targets}
                  key={plotSearch.id}
                  selectedTarget={props.selectedTarget}
                  plotSearch={plotSearch}
                  setSelectedTarget={props.setSelectedTarget}
                  categoryIndex={index}
                  categorySymbol={item.category.symbol}
                  favouritedTargets={props.favourite.targets}
                  hoveredTargetId={props.hoveredTargetId}
                  setHoveredTargetId={props.setHoveredTargetId}
                />
              );
            }
          }),
      )}
    </MapContainer>
  );
};

export default MapComponent;
