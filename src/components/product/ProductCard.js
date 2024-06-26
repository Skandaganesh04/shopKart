import React, { useContext } from 'react';
import { IoMdStar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { displayMoney } from '../../helpers/utils';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';


const ProductCard = (props) => {

    const { id, images, title, info, finalPrice, originalPrice, rateCount, path } = props;

    const { addItem } = useContext(cartContext);
    const { active, handleActive, activeClass } = useActive(false);


    const handleAddItem = async () => {
        try {
        if(props.auth){
            const item = { ...props };
            addItem(item);
            handleActive(id); 
            setTimeout(() => {
                handleActive(false);
            }, 3000);
            const email = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8000/api/user/products/${id}?add=true`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email})
            });
            if(res.status !== 201){
                throw new Error("an error in adding product");
            }
        }else{
            alert("please login");
        }     
    } catch (err) {
        console.log(`an server error:${err}`);
    }
    };

    const newPrice = displayMoney(finalPrice);
    const oldPrice = displayMoney(originalPrice);


    return (
        <>
            <div className="card products_card">
                <figure className="products_img">
                    <Link to={`${path}${id}`}>
                        <img src={images[0]} alt="product-img" />
                    </Link>
                </figure>
                <div className="products_details">
                    <span className="rating_star">
                        {
                            [...Array(rateCount)].map((_, i) => <IoMdStar key={i} />)
                        }
                    </span>
                    <h3 className="products_title">
                        <Link to={`${path}${id}`}>{title}</Link>
                    </h3>
                    <h5 className="products_info">{info}</h5>
                    <div className="separator"></div>
                    <h2 className="products_price">
                        {newPrice} &nbsp;
                        <small><del>{oldPrice}</del></small>
                    </h2>
                    <button
                        type="button"
                        className={`btn products_btn ${activeClass(id)}`}
                        onClick={handleAddItem}
                    >
                        {active ? 'Added' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductCard;