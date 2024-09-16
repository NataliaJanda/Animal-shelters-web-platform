import React, {useEffect, useState} from "react";
import "./Background.css";
import ShelterRegisterButton from "../ShelterRegister/ShelterRegisterButton";
import {HeroOverlay, HeroSection, HeroText
} from "../Navbar/style";

const Background = () =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
    } else {
    setIsLoggedIn(false);
    }
    }, []);

    return (
        <>
            <HeroSection>
                <HeroOverlay>
                    <HeroText>
                        <h1>Dołącz do nas!</h1>
                        <p>
                            {isLoggedIn ? (<></>
                            ) : (
                                <>
                                    <ShelterRegisterButton/>
                                </>
                            )}
                        </p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>
        </>
    );
}

export default Background;
