import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import React, { useEffect, useRef, useState } from 'react';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';

// Tabs Joyerialis
const tabs = [
  "Toda la Colección",
  "Pulseras",
  "Collares",
  "Aretes"
];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const activeRef = useRef(null);
  const marker = useRef(null);

  const {
    data: products,
    isError,
    isLoading
  } = useGetProductTypeQuery({ type: 'jewelry' });

  useEffect(() => {
    if (activeRef.current && marker.current) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab, products]);

  const handleActiveTab = (e, tab) => {
    setActiveTab(tab);
  };

  let content = null;

  if (isLoading) {
    content = (
      <HomeTwoPrdLoader loading={isLoading} />
    );
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Hubo un error al cargar los productos" />;
  }

  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No se encontraron productos" />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {

    let product_items = products.data;

    if (activeTab === 'Toda la Colección') {
      product_items = products.data;
    }
    else if (activeTab === 'Pulseras') {
      product_items = products.data.filter(
        p => p.category.name === 'Bracelets'
      );
    }
    else if (activeTab === 'Collares') {
      product_items = products.data.filter(
        p => p.category.name === 'Necklaces'
      );
    }
    else if (activeTab === 'Aretes') {
      product_items = products.data.filter(
        p => p.category.name === 'Earrings'
      );
    }

    // Limitar catálogo para mantener estilo premium
    product_items = product_items.slice(0, 8);

    content = (
      <>
        <div className="row align-items-end">
          <div className="col-xl-6 col-lg-6">
            <div className="tp-section-title-wrapper-4 mb-40 text-center text-lg-start">
              <span className="tp-section-title-pre-4">
                JOYERIALIS
              </span>

              <h3 className="tp-section-title-4">
                Nuestra Colección
              </h3>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <div className="tp-product-tab-2 tp-product-tab-3 tp-tab mb-45">
              <div className="tp-product-tab-inner-3 d-flex align-items-center justify-content-center justify-content-lg-end">
                <nav>
                  <div
                    className="nav nav-tabs justify-content-center tp-product-tab tp-tab-menu p-relative"
                    id="nav-tab"
                    role="tablist"
                  >
                    {tabs.map((tab, i) => (
                      <button
                        key={i}
                        ref={activeTab === tab ? activeRef : null}
                        onClick={(e) => handleActiveTab(e, tab)}
                        className={`nav-link text-capitalize ${
                          activeTab === tab ? "active" : ""
                        }`}
                      >
                        {tab}
                        <span className="tp-product-tab-tooltip">
                          {product_items.length}
                        </span>
                      </button>
                    ))}

                    <span
                      ref={marker}
                      id="productTabMarker"
                      className="tp-tab-line d-none d-sm-inline-block"
                    ></span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {product_items.map((prd) => (
            <div
              key={prd._id}
              className="col-xl-3 col-lg-4 col-sm-6"
            >
              <ProductItem product={prd} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <section
      className="tp-product-area pt-115 pb-80"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div className="container">
        {content}
      </div>
    </section>
  );
};

export default ProductArea;