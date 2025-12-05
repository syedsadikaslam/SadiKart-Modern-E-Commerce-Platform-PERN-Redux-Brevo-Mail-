import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, toggleCart, toggleSearchBar, toggleSidebar } from "../../store/slices/popupSlice";


const Navbar = () => {

  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  let cartItemCount = 0;
  if (cart) {
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <>
      <nav className="fixed left-0 top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LEFT SIDE — Hamburger only when logged in */}
            {authUser ? (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Menu className="w-6 h-6 text-foreground" />
              </button>
            ) : (
              /* When not logged in → keep space equal to menu button */
              <div className="h-12 object-contain select-none"></div>
            )}

            {/* CENTER LOGO */}
            <div className={`${authUser ? "flex-1 flex justify-center" : "flex-1 flex justify-start"}`}>
              <link />
              <img
                src="/logo.png"
                alt="SadiKart Logo"
                className="h-12 object-contain select-none cursor-pointer
                hover:glow-on-hover animate-smooth text-foreground hover:text-primary group"
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">

              {/* Theme toggle */}
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* Search overlay */}
              <button onClick={() => dispatch(toggleSearchBar())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Search className="w-5 h-5 text-foreground" />
              </button>

              {/* User Profile */}
              <button onClick={() => dispatch(toggleAuthPopup())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <User className="w-5 h-5 text-foreground" />
              </button>

              {/* Cart */}
              <button onClick={() => dispatch(toggleCart())} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {
                  cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )
                }
              </button>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
