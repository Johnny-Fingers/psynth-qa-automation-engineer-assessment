from datetime import datetime
from ..models import Assessment

def get_classification(score: int) -> str:
    """
    Returns the classification label based on the standard score ranges
    provided in the assessment instructions.
    """

    if score >= 130:
        return "Very Superior"
    elif score >= 120:
        return "Superior"
    elif score >= 110:
        return "High Average"
    elif score >= 90:
        return "Average"
    elif score >= 80:
        return "Low Average"
    elif score >= 70:
        return "Borderline"
    else:
        return "Extremely Low"
    
def generate_narrative(assessment: Assessment) -> str:
    """
    Generates a human-readable narrative summary of the assessment.
    """
    client = assessment.client
    fsiq = assessment.scores.full_scale_iq
    indices = assessment.scores.primary_indices

    date_str = assessment.assessment.date_administered
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        formatted_date = date_obj.strftime("%B %d, %Y")
    except ValueError:
        formatted_date = date_str  # Fallback if format is weird

    # 1. Introduction
    intro = (
        f"{client.first_name} {client.last_name}, a {client.age_at_assessment}-year-old "
        f"{client.gender.lower()} in {client.grade} grade, was referred for testing to address {client.referral_reason.lower()}. "
        f"The {assessment.assessment.full_name} was administered on {formatted_date}."
    )

    # 2. General Cognitive Ability (FSIQ)
    # We verify the classification dynamically using our helper logic
    fsiq_desc = get_classification(fsiq.score)

    general_ability = (
        f"\n\nOn the Full Scale IQ (FSIQ), {client.first_name} obtained a score of {fsiq.score}, "
        f"which falls into the **{fsiq_desc}** range (Percentile: {fsiq.percentile}). "
        f"This composite score represents overall general cognitive ability."
    )

    # 3. Specific Domains (Indices)
    # We list out the primary indices to provide detail
    domain_details = "\n\nPerformance across specific cognitive domains was as follows: "
    for index in indices:
        classification = get_classification(index.score)
        domain_details += (
            f"\n- **{index.name} ({index.abbreviation}):** Score of {index.score} "
            f"({classification}, Percentile: {index.percentile})"
        )
    
    # 4. Summary/Conclusion (Check of weakness/strengths)
    weakness = [
        ind.name for ind in indices
        if get_classification(ind.score) in ["Low Average", "Borderline", "Extremely Low"]
    ]

    strengths = [
        ind.name for ind in indices
        if get_classification(ind.score) in ["Very Superior", "Superior"]
    ]

    conclusion = "\n\n**Summary:** "
    if strengths:
        conclusion += f"{client.first_name} demonstrated particular strength in {', '.join(strengths)}. "

    if weakness:
        conclusion += f"Areas warranting further attention or support include {', '.join(weakness)}."
    elif not strengths:
        conclusion += f"{client.first_name}'s cognitive profile is generally consistent with age-level expectations."

    # Combine everything together
    return intro + general_ability + domain_details + conclusion