WYK Platform - Detailed User Journeys

Overview

This document outlines the key user journeys within the Who You Know (WYK) platform, a centralised marketplace connecting job seekers with companies and recruiters in Jersey. The platform facilitates CV visibility management for individuals while providing companies and recruiters with access to talent.

---

1. Individual User Journeys

1.1 Registration and Profile Creation

User Goal: Create an account on WYK and establish a professional profile

Journey Steps:

1. Landing on Homepage
  * User navigates to WYK platform
  * User clicks "User Log-in" button
  * System displays registration/login options
2. Account Creation
  * User selects social media login option:
    * Google
    * Apple
    * Facebook
  * User authorises social media connection
  * User accepts Privacy Notice and Website T&Cs
  * System creates account using social profile data
  * User completes any additional required information
3. Profile Setup
  * User provides basic information:
    * Current city/county/country
    * Desired working location (Jersey/WFH)
    * Right to work status
  * User sets preferences:
    * Desired sectors to work in
    * Desired salary range
    * Current employment status (Open to offers/Actively looking)
  * User specifies marketing preferences
  * System creates user profile

Touchpoints:

* Homepage
* Social media authorisation screens
* Profile creation screens

---

1.2 CV Upload and Management

User Goal: Upload CV and manage visibility settings

Journey Steps:

1. CV Upload
  * User navigates to "Upload CV" section
  * User uploads CV document
  * System processes CV upload
2. AI Analysis
  * System performs AI analysis of CV via N8N workflow
  * System extracts key information:
    * Keywords/skills
    * Previous roles/companies
    * Seniority level (current/seeking)
    * Qualifications
    * AI summary of experience and background
    * Automatic tagging of user with relevant skills/industry
3. Review and Customise
  * User reviews AI-processed information
  * User makes any necessary corrections
  * User sets CV status as viewable or non-viewable
  * User edits public view information (brief summary)
  * System handles visibility tiers automatically:
    * Public view (limited info/brief summary)
    * Recruiter view (more detailed information)
  * User confirms settings
4. LinkedIn Integration (Optional)
  * System prompts user to connect LinkedIn profile
  * User authorises LinkedIn connection (if desired)
  * System syncs relevant information

Touchpoints:

* CV upload interface
* AI analysis review screen
* Visibility settings dashboard
* LinkedIn authorisation prompt

---

1.3 Job Discovery and Application

User Goal: Find relevant job opportunities in Jersey

Journey Steps:

1. Accessing Job Listings
  * User logs into account
  * System displays personalised job dashboard with:
    * Roles matched to user profile
    * High-match opportunities highlighted
    * Saved/favourited jobs section
2. Job Search and Filtering
  * User manually reviews available roles
  * User filters jobs by:
    * Sector/category
    * Salary range
    * Location (Jersey/remote)
    * Role type
  * User can save/favourite jobs for later review
3. Viewing Job Details
  * User clicks on interesting role
  * System displays:
    * Role details
    * Company logo/information
    * Apply button
4. Application Process
  * User clicks "Apply" button within the WYK platform
  * System presents application form with:
    * Option to include cover letter/message
    * User's current CV automatically attached
    * Option to upload customised CV for this specific role
  * User reviews and submits application
  * System delivers application to company/recruiter
  * User receives confirmation of submission

Touchpoints:

* Job listings dashboard
* Search filters
* Job detail pages
* Application form
* Submission confirmation

---

1.4 Recruiter Request Management

User Goal: Manage contact requests from companies/recruiters

Journey Steps:

1. Receiving Request
  * Company/recruiter requests contact with user
  * System notifies user via:
    * Email notification
    * In-app notification
  * User reviews request details:
    * Company name
    * Role recruiting for
    * Target salary range
    * Short message
2. Request Evaluation
  * User reviews company profile
  * User considers opportunity fit
3. Response Actions
  * Approval Path:
    * User approves contact request
    * User's full CV is shared with company
    * System shares user's contact details with company
    * Internal messaging system enables communication
  * Decline Path:
    * User declines contact request
    * User can personalise the standardised decline message
    * User's contact details and full CV remain private
    * System sends decline message to company
4. Ongoing Management
  * User can view history of requests
  * User can manage active connections
  * User receives periodic reminders to update status

Touchpoints:

* Notification centre
* Request detail view
* Company profile view
* Approval/decline confirmation
* Messaging interface
* Decline message customisation screen

---

1.5 Profile Maintenance

User Goal: Keep profile information current and relevant

Journey Steps:

1. Regular Profile Updates
  * System sends monthly notification to attest job status
  * User confirms or updates employment status
  * System sends bi-annual reminder to review CV
  * User reviews and refreshes CV information
2. Status Management
  * User updates status as needed:
    * "Actively looking"
    * "Open to offers"
    * "Not available"
  * System updates visibility based on status
3. CV Analytics Review
  * User views profile engagement metrics
  * User sees number of profile views
  * User tracks contact requests received
4. Account Settings
  * User manages privacy preferences
  * User updates contact information
  * User adjusts notification settings
5. Saved Content Management
  * User reviews saved/favourited jobs
  * User removes outdated saved items
  * User receives notifications about saved job changes

Touchpoints:

* Profile management dashboard
* Status update prompts
* CV analytics dashboard
* Account settings panel
* Saved items library

---

2. Company/Recruiter User Journeys

2.1 Registration and Profile Creation

User Goal: Establish company presence on WYK platform

Journey Steps:

1. Landing on Homepage
  * Company representative navigates to WYK platform
  * Representative clicks "Business Log-in" button
  * System displays registration/login options
2. Tenant Registration
  * Representative registers company as tenant:
    * Company name
    * Company type (employer/recruitment agency)
    * Contact name
    * Email address
    * Password or social media login
    * Contact details
  * Representative uploads company logo
  * Representative provides company background/bio
  * Representative accepts Privacy Notice and Website T&Cs
  * System creates company tenant account
3. User Management
  * Primary administrator adds additional users:
    * Enters email addresses for team members
    * Assigns permission levels
    * System sends invitations to join company account
  * Additional users complete registration process
  * Administrator manages user access
4. Access Selection
  * Representative selects access type:
    * Free
    * Intro Offer (code-based)
    * Paid subscription (Monthly/Annual)
    * Credit purchase options
  * For paid options, representative completes payment process
  * System activates appropriate access level

Touchpoints:

* Homepage
* Business registration form
* Company profile creation
* User management dashboard
* Subscription selection
* Payment processing

---

2.2 CV Discovery and Contact Requests

User Goal: Find relevant talent and initiate contact

Journey Steps:

1. Browsing Available CVs
  * Free Tier Experience:
    * Representative browses analytical information only:
      * Industry experience statistics
      * Location distribution
      * Desired sector breakdown
    * Representative sees talent summaries and skill sets
    * Representative can save/favourite profiles for later review
  * Paid Tier Experience:
    * Representative accesses detailed CV information:
      * Comprehensive experience details
      * Educational background
      * Full skill assessment
      * Career achievements
    * Representative can contact candidates directly
    * Access based on subscription or credit system
2. CV Filtering and Review
  * Representative filters CV database by:
    * Industry experience
    * Salary expectations
    * Location preferences
    * Status (actively looking/open to offers)
  * Representative reviews matching profiles
  * Representative saves promising candidates
3. Contact Request Process
  * Representative selects candidate of interest
  * Credit-based access:
    * Representative spends credit to view full details
    * System deducts credit from account balance
  * Representative creates contact request:
    * Includes role recruiting for (optional)
    * Specifies target salary range
    * Writes short introduction message
  * System sends request to individual user
  * System notifies representative of request status:
    * Pending
    * Approved (with contact details provided)
    * Declined (with candidate's response)
4. Communication Management
  * For approved contacts, representative engages via internal messaging
  * Representative tracks ongoing conversations
  * Representative manages candidate pipeline

Touchpoints:

* CV analytics dashboard
* CV listing interface
* Profile detail views
* Credit purchase/usage tracking
* Contact request form
* Messaging interface
* Request status tracking
* Saved candidates library

---

2.3 Job Posting and Management

User Goal: Post and manage open roles

Journey Steps:

1. Job Creation
  * Representative navigates to job management area
  * Representative creates new job listing with:
    * Role details
    * Required qualifications
    * Salary information
    * Application process
  * System validates and processes listing
  * For paid users, options for premium placement
2. Job Monitoring
  * Representative views listing analytics:
    * View counts
    * Engagement metrics
    * Potential matches
    * Application volume
  * Representative updates listings as needed
3. Candidate Engagement
  * Representative reviews interested candidates
  * Representative initiates contact requests
  * Representative tracks application progress
  * Representative saves promising applicants
4. Role Management
  * Representative updates role status (open/filled)
  * Representative archives completed recruitments
  * Representative reposts modified listings as needed

Touchpoints:

* Job creation form
* Listing management dashboard
* Job analytics interface
* Candidate tracking system
* Saved applicants library

---

2.4 Subscription Management

User Goal: Manage platform access and subscription

Journey Steps:

1. Accessing Account Settings
  * Representative navigates to "Membership" section
  * System displays current subscription details
2. Subscription Changes
  * Upgrade Path:
    * Representative selects higher tier
    * Representative confirms payment changes
    * System immediately upgrades access
  * Credit Purchase:
    * Representative selects credit package
    * Representative completes payment
    * System adds credits to account balance
    * Credits enable full CV viewing and contact requests
  * Renewal Path:
    * System notifies of upcoming renewal
    * Representative confirms continuation
    * System processes renewal payment
  * Downgrade/Cancel Path:
    * Representative selects lower tier or cancellation
    * System confirms change effective date
    * System adjusts access level at next billing cycle
3. Usage Monitoring
  * Representative views usage statistics:
    * Contact requests sent/approved
    * CV views
    * Job listing performance
    * Credits remaining
  * Representative evaluates ROI
4. Payment Management
  * Representative updates payment method
  * Representative accesses invoice history
  * Representative downloads receipts

Touchpoints:

* Membership dashboard
* Subscription management interface
* Credit purchase interface
* Payment information form
* Usage analytics dashboard
* Billing history

---

3. Administrative User Journeys

3.1 Platform Monitoring

User Goal: Ensure platform health and performance

Journey Steps:

1. Dashboard Overview
  * Admin logs into admin panel
  * System displays key metrics:
    * User registrations (individual and business)
    * Active listings
    * Contact request volume
    * Subscription status
    * Jobs posted
    * Premium placements volume
    * Credit purchases and usage
    * Revenue metrics
    * User engagement rates
    * Application submissions
    * Conversion rates
2. Content Moderation
  * Admin reviews flagged content
  * Admin approves/rejects questionable listings
  * Admin moderates user-generated content
3. User Support
  * Admin accesses support requests
  * Admin resolves user issues
  * Admin communicates with users
4. Performance Monitoring
  * Admin reviews system performance metrics
  * Admin identifies potential issues
  * Admin initiates optimisations

Touchpoints:

* Admin dashboard
* Moderation queue
* Support ticket system
* Performance analytics

---

3.2 System Management

User Goal: Maintain system integrity and compliance

Journey Steps:

1. Data Review
  * Admin accesses database reports
  * Admin verifies data integrity
  * Admin identifies anomalies
2. User Data Management
  * Admin processes data correction requests
  * Admin handles deletion requests
  * Admin ensures GDPR compliance
3. System Backup
  * Admin schedules regular backups
  * Admin verifies backup integrity
  * Admin documents backup procedures
4. Security Monitoring
  * Admin reviews security logs
  * Admin investigates suspicious activities
  * Admin implements security enhancements

Touchpoints:

* Database management interface
* Data request processing system
* Backup monitoring dashboard
* Security log analyser

---

3.3 Enquiry Management

User Goal: Address user support needs and enquiries

Journey Steps:

1. Ticket Reception
  * System receives support tickets from users and businesses
  * System categorises enquiries by type
  * Admin receives notification of new tickets
2. Enquiry Assessment
  * Admin reviews enquiry details
  * Admin prioritises based on urgency/impact
  * Admin assigns to appropriate team member (if applicable)
3. Response Process
  * Admin investigates issue
  * Admin formulates response
  * Admin communicates with enquiring user
  * Admin documents resolution
4. Follow-up and Closure
  * Admin confirms issue resolution with user
  * Admin marks ticket as resolved
  * Admin updates knowledge base for common issues
  * System tracks resolution metrics

Touchpoints:

* Ticketing system dashboard
* Enquiry detail view
* Response interface
* Resolution tracking
* Knowledge base management

---

4. Cross-Journey Touchpoints

4.1 Messaging System

Key Functionality:

* Secure communication between users and companies
* Message history tracking
* Notification delivery
* Attachment support (optional)

User Interactions:

* Individual users respond to enquiries
* Companies initiate conversations
* Both parties manage ongoing discussions

4.2 Notification Centre

Key Functionality:

* Email notifications for critical events
* In-app notification hub
* Preference management
* Action-oriented alerts

User Interactions:

* Users receive status updates
* Users act on time-sensitive requests
* Users manage notification preferences

4.3 Help and Support

Key Functionality:

* FAQ repository
* Guided tutorials
* Contact support options
* Issue reporting

User Interactions:

* Users access self-help resources
* Users submit support tickets
* Users receive assistance for platform usage

4.4 Saved Items Library

Key Functionality:

* Save/favourite functionality for jobs and profiles
* Organisation options
* Status tracking
* Update notifications

User Interactions:

* Individual users save interesting jobs
* Companies save promising candidates
* Users manage and review saved items

---

5. Success Metrics

5.1 Individual User Success

* Engagement Metrics:
  * Profile completion rate
  * CV upload rate
  * Job view activity
  * Return visit frequency
  * Saved jobs volume
* Outcome Metrics:
  * Contact request approval rate
  * Successful placements (if tracked)
  * Time to placement

5.2 Company/Recruiter Success

* Engagement Metrics:
  * CV search activity
  * Contact request volume
  * Job posting frequency
  * Session duration
  * Saved candidates volume
* Outcome Metrics:
  * Contact request acceptance rate
  * Candidate pipeline building
  * Subscription renewal rate
  * Credit purchase frequency
  * Successful placements

5.3 Platform Success

* Growth Metrics:
  * New user registrations
  * User retention rate
  * Paid conversion rate
  * Market penetration
* Financial Metrics:
  * Monthly recurring revenue
  * Average revenue per user
  * Customer acquisition cost
  * Lifetime value
  * Credit purchase volume

---

6. Journey Optimisation Opportunities

6.1 Onboarding Enhancement

* Guided walkthrough for first-time users
* Progress indicators for profile completion
* Contextual help at decision points
* Sample profiles for reference

6.2 AI-Driven Recommendations

* Smart matching between CVs and jobs
* Personalised role suggestions
* Company recommendations for users
* Talent recommendations for companies

6.3 Feedback Integration

* Post-action satisfaction surveys
* Feature request collection
* User testing recruitment
* A/B testing of journey variations

---

7. Implementation Considerations

7.1 Technical Dependencies

* CV parsing technology integration
* Payment processing system
* Email notification service
* Analytics implementation

7.2 Content Requirements

* Clear privacy notices
* Comprehensive terms and conditions
* User guidance content
* FAQ development

7.3 Testing Requirements

* Journey validation with user testing
* Edge case identification
* Performance under load
* Cross-device compatibility

---

This document serves as a blueprint for implementing user journeys within the WYK platform. Each journey should be validated with actual users during development and optimised based on usage data after launch.