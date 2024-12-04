import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';
import useStore from '../../store';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('username');
  const { userdata } = useStore();

  // States for mortgage details
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMortgage, setHasMortgage] = useState(null);
  const [isLookingForMortgage, setLookForMortgage] = useState(null);
  const [mortgageCount, setMortgageCount] = useState(1);
  const [mortgageType, setMortgageType] = useState('');
  const [mortgageAmount, setMortgageAmount] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [newMortgageAmount, setNewMortgageAmount] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');

  const submitData = async () => {
    const data = hasMortgage
      ? {
          hasMortgage,
          mortgageCount,
          mortgageType,
          mortgageAmount,
          renewalDate,
          username: userdata.username,
        }
      : {
          hasMortgage,
          isLookingForMortgage,
          newMortgageAmount,
          ownershipType,
          annualIncome,
          username: userdata.username,
        };

    axios.put(`http://127.0.0.1:8000/mortgage/${userdata.username}`, data)
    .then((response) => {
      console.log('Response:', response.data);
      alert('Data submitted successfully!');
    })
    .catch ((error)=>{
      console.error('Error submitting data:', error);
      alert('Failed to submit data.');
    })
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return hasMortgage !== null;
      case 2:
        return hasMortgage ? mortgageCount : isLookingForMortgage !== null; 
      case 3:
        return hasMortgage ? renewalDate.trim() !== '' : newMortgageAmount.trim() !== '';
      case 4:
        return hasMortgage ? mortgageAmount.trim() !== '' : ownershipType !== '';
      case 5:
        return hasMortgage ? mortgageType !== '' : annualIncome.trim() !== '';
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="guest-info">
          <h2>Welcome to Our Application</h2>
          <p>We provide financial tools to help you manage your mortgage needs efficiently.</p>
          <p>Sign in to access personalized features and manage your mortgage data seamlessly.</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="step-item">
            <label>Do you have a mortgage?</label>
            <div>
              <label className='radio-btn'>
                <input
                  type="radio"
                  name="mortgage"
                  value="yes"
                  required
                  onChange={() => setHasMortgage(true)}
                />
                Yes
              </label>
              <label className='radio-btn'>
                <input
                  type="radio"
                  name="mortgage"
                  value="no"
                  onChange={() => setHasMortgage(false)}
                />
                No
              </label>
            </div>
          </div>
        );
      case 2:
        if (hasMortgage) {
          return (
            <div className="step-item">
              <label>How many mortgages do you have?</label>
              <select value={mortgageCount} onChange={(e) => setMortgageCount(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="more">More</option>
              </select>
            </div>
          );
        } else {
          return (
            <div className="step-item">
            <label>Are you looking for new mortgage?</label>
            <div>
              <label className='radio-btn'>
                <input
                  type="radio"
                  name="look-for-mortgage"
                  value="yes"
                  required
                  onChange={() => setLookForMortgage(true)}
                />
                Yes
              </label>
              <label className='radio-btn'>
                <input
                  type="radio"
                  name="look-for-mortgage"
                  value="no"
                  onChange={() => setLookForMortgage(false)}
                />
                No
              </label>
            </div>
          </div>
          );
        }
      case 3:
        if (hasMortgage) {
          return (
            <div className="step-item">
              <label>Mortgage renewal or fixed term end date:</label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
              />
            </div>
          );
        } 
        else if(isLookingForMortgage){
          return (

            <div className="step-item">
              <label>Approximate mortgage amount:</label>
              <input
                type="number"
                placeholder="Enter approximate amount"
                value={newMortgageAmount}
                onChange={(e) => setNewMortgageAmount(e.target.value)}
              />
            </div>
          );
        }
        else{
          return (
            <div className="step-item"><h3>Thank you for visiting!</h3></div>
          );
        }
      case 4:
        if (hasMortgage) {
          return (
            <div className="step-item">
              <label>Mortgage amount:</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={mortgageAmount}
                onChange={(e) => setMortgageAmount(e.target.value)}
              />
            </div>
          );
        } else {
          return (
            <div className="step-item">
              <label>Is it joint or single?</label>
              <select value={ownershipType} onChange={(e) => setOwnershipType(e.target.value)}>
                <option>Select</option>
                <option value="joint">Joint</option>
                <option value="single">Single</option>
              </select>
            </div>

            
          );
        }
      case 5:
        if (hasMortgage) {
          return (
            <div className="step-item">
              <label>Type:</label>
              <select value={mortgageType} onChange={(e) => setMortgageType(e.target.value)}>
                <option>Select</option>
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
              </select>
            </div>
          );
        } else {
          return (
            <div className="step-item">
              <label>Annual income:</label>
              <input
                type="number"
                placeholder="Enter your annual income"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
              />
            </div>
          )
        }
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      alert('Please complete the current step before proceeding.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="main-div">
      <div className="user-details">
        {isLoggedIn ? (
          <>
            <p id="user_details">&#x1F464; {userdata.name}</p>
            <p id="user_details">&#x1F4DE; {userdata.contactnumber}</p>
            <p id="user_details">&#x2709; {userdata.email}</p>
          </>
        ) : (
          <div className="guest-content">
            <h2>Hey Guest !!</h2>
            <p>Please login or register to access personalized features.</p>
          </div>
        )}
      </div>
      <div className="home">
        <div className="step-content">{renderStepContent()}</div>
        {isLoggedIn && (
          <div className="navigation-buttons">
            <button onClick={prevStep} disabled={currentStep === 1}>Previous</button>
            {currentStep < 5 && <button onClick={nextStep}>Next</button>}
            {currentStep === 5 && <button onClick={submitData}>Submit</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
