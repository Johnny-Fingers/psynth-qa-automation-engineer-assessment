from fastapi.testclient import TestClient
import pytest
from ..main import app
from ..db import assessments
from ..models import Assessment, Client, AssessmentInfo, Scores, ScoreItem, Subtest

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_data():
    """
    Reset the in-memory database before each test.
    Load the mock assessment (Eleven) to test against so we don't need to rely on the sample_data.json file,
    which could change over time and break the tests.
    """
    assessments.clear()

    # Create a dummy assessment for testing
    mock_assessment = Assessment(
        id="asmt_eleven",
        client=Client(
            id="client_011",
            first_name="Jane",
            last_name="Hopper",
            date_of_birth="1971-06-07",
            age_at_assessment=12,
            gender="Female",
            grade="6th",
            school="Hawkins Middle School",
            referral_reason="concerns regarding social adjustment and telekinetic outbursts"
    ),
    assessment = AssessmentInfo(
        type="WISC-V",
        full_name="Wechsler Intelligence Scale for Children - Fifth Edition",
        date_administered="1983-11-06",
        examiner="Dr. Sam Owens",
        status="completed"
    ),
    scores = Scores(
        full_scale_iq=ScoreItem(score=115, percentile=84, classification="High Average"),
        primary_indices=[
            # High Fluid Reasoning (solving problems)
            ScoreItem(name="Fluid Reasoning", abbreviation="FRI", score=135, percentile=99, classification="Very Superior"),
            # Lower Verbal (limited vocabulary)
            ScoreItem(name="Verbal Comprehension", abbreviation="VCI", score=78, percentile=7, classification="Borderline")
        ],
        subtests=[
            Subtest(name="Matrix Reasoning", scaled_score=17, index="FRI")
        ]
    ),
    clinical_notes=[]
    )

    assessments.append(mock_assessment)

def test_get_assessment_list():
    """
    Test listing all assessments.
    """
    response = client.get("/api/assessments")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["client_name"] == "Jane Hopper"
    assert data[0]["status"] == "completed"

def test_filter_assessments():
    """
    Test filtering assessments by status.
    """
    response = client.get("/api/assessments?status=completed")
    assert response.status_code == 200
    assert len(response.json()) == 1

    response = client.get("/api/assessments?status=pending_review")
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_get_assessment_detail_success():
    """
    Test retrieving an assessment by ID.
    """
    response = client.get("/api/assessments/asmt_eleven")
    assert response.status_code == 200
    data = response.json()

    assert data["client"]["first_name"] == "Jane"
    assert data["client"]["last_name"] == "Hopper"
    assert data["client"]["referral_reason"] == "concerns regarding social adjustment and telekinetic outbursts"

def test_get_assessment_detail_not_found():
    """
    Test retrieving an assessment that doesn't exist.
    """
    response = client.get("/api/assessments/demogorgon_001")

    assert response.status_code == 404

def test_add_clinical_note():
    """
    Test adding a clinical note to an assessment.
    """
    payload = {
        "content": "Subject nose bled during Block Design subtest.",
        "author": "Dr. Martin Brenner"
    }

    response = client.post("/api/assessments/asmt_eleven/notes", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert len(data["clinical_notes"]) == 1
    assert "nose bled" in data["clinical_notes"][0]["content"]

def test_generate_narrative():
    """
    Test generating a narrative for an assessment.
    """
    response = client.get("/api/assessments/asmt_eleven/narrative")
    assert response.status_code == 200

    data = response.json()
    text = data["narrative"]

    # Check for character-specific details
    assert "Jane Hopper" in text
    assert "High Average" in text # FSIQ
    assert "Very Superior" in text # Her strength (FRI)
    assert "Borderline" in text    # Her weakness (VCI)
    
    # Verify summary logic
    assert "Fluid Reasoning" in text # Should be listed as a strength
    assert "Verbal Comprehension" in text # Should be listed as a weakness