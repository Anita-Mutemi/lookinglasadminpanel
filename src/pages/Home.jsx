import ParsingStats from '../components/Analytics/ParsingStats';
import TaggingStats from '../components/Analytics/TaggingStats';
import Filters from '../components/Filters';
import Feed from './Feed';
import { GeneralErrorBoundary } from '../components/UI/GeneralErrorBoundry';

const Home = () => {
  return (
    <div>
      <GeneralErrorBoundary customMessage='Parsing stats has broken down'>
        <ParsingStats />
      </GeneralErrorBoundary>
      <GeneralErrorBoundary customMessage='Tagging stats has broken down'>
        <TaggingStats />
      </GeneralErrorBoundary>
      <br />
      {/* <Filters endpoint={`/v1/projects/filters`} /> */}
      <Feed
        type={[
          'accepted',
          'pending',
          'discovered',
          'published',
          'uploaded',
          'not_in_scope',
        ]}
      />
    </div>
  );
};

export default Home;
