from fastapi import APIRouter, HTTPException
from fastapi.templating import Jinja2Templates
from config.db import conn
from fastapi.responses import JSONResponse
from models.model import User, LoginModel, Token, MortgageDetails
from auth.userauth import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

user = APIRouter()

templates = Jinja2Templates(directory="templates")

@user.post("/register", response_class= JSONResponse)
async def add_user(request: User):
    try:
        print(request)
        user = conn.user.mortgage_details.insert_one(dict(request))
        user_details = {
        "name": request.name,
        "username": request.username,
        "email": request.email,
        "contactnumber": request.contactnumber
        }
        return {"user_details": user_details}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

@user.post("/login", response_model=Token)
async def login(login_data: LoginModel):
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": login_data.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    user_details = {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "contactnumber": str(user.get("contactnumber", "")),
    }
    return {"access_token": access_token, "token_type": "bearer", "user_details": user_details}

@user.put("/mortgage/{username}")
async def update_mortgage_details(username: str, details: MortgageDetails):
    # Check if the user exists in the database
    existing_user = conn.user.mortgage_details.find_one({"username": username})

    if existing_user:
        # Update the existing user's data
        conn.user.mortgage_details.update_one(
            {"username": username},
            {"$set": details.dict()}
        )
        return {"message": "User data updated successfully!", "data": details}