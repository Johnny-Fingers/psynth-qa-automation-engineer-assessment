import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import AssessmentList from './pages/AssessmentList.tsx';
import AssessmentDetail from './pages/AssessmentDetail';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root URL to the assessments list */}
          <Route path="/" element={<Navigate to="/assessments" replace />} />

          {/* List View */}
          <Route path="/assessments" element={<AssessmentList />} />

          {/* Detailed View */}
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
